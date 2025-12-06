import React, { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { VoiceRecorderProps } from "../types";
import { transcribeAudio } from "../api";

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onParsed }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const toggleRecording = async () => {
    if (isProcessing) return;

    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "audio/mp4",
        });

        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsRecording(false);
          setIsProcessing(true);

          // Create audio file from recorded chunks
          const audioFile = new File(chunksRef.current, "recording.webm", {
            type: mediaRecorder.mimeType,
          });

          try {
            // Send audio to backend for transcription
            const result = await transcribeAudio(audioFile);
            onParsed(result.data);
          } catch (error) {
            console.error("Error processing audio:", error);
            toast.error("Failed to process voice command.");
          } finally {
            setIsProcessing(false);
            // Release microphone
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          setIsRecording(false);
          setIsProcessing(false);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Failed to access microphone. Please grant permission.");
      }
    }
  };

  return (
    <button
      onClick={toggleRecording}
      disabled={isProcessing}
      className={`btn ${isRecording ? "btn-destructive animate-pulse" : "btn-header-outline"}`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="animate-spin" size={16} /> Processing...
        </>
      ) : isRecording ? (
        <>
          <MicOff size={16} /> Stop Listening
        </>
      ) : (
        <>
          <Mic size={16} /> Voice Add
        </>
      )}
    </button>
  );
};

export default VoiceRecorder;

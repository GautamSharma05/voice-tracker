import React from "react";
import { Plus } from "lucide-react";
import { Task } from "../api";
import VoiceRecorder from "./VoiceRecorder";

interface LayoutProps {
  children: React.ReactNode;
  onVoiceParsed: (data: Partial<Task>) => void;
  onCreateOpen: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onVoiceParsed,
  onCreateOpen,
}) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container flex-between" style={{ height: "4rem" }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div className="logo-icon">V</div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                letterSpacing: "-0.025em",
              }}
            >
              VoiceTask
            </h1>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <VoiceRecorder onParsed={onVoiceParsed} />
            <button onClick={onCreateOpen} className="btn-header-primary">
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </header>

      <main
        className="container"
        style={{ flex: 1, paddingTop: "2rem", paddingBottom: "3rem" }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

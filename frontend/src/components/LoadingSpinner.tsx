import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        gap: "1rem",
        color: "var(--muted-foreground)",
      }}
    >
      <Loader2
        className="animate-spin"
        size={32}
        style={{ color: "var(--primary)" }}
      />
      <span>Loading tasks...</span>
    </div>
  );
};

export default LoadingSpinner;

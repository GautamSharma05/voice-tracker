import React from "react";

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: "#fee2e2",
          color: "#ef4444",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "2rem",
        }}
      >
        !
      </div>
      <div>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "400px" }}>
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      {resetErrorBoundary && (
        <button
          className="btn btn-primary"
          onClick={resetErrorBoundary}
          style={{ padding: "0.75rem 1.5rem" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorPage;

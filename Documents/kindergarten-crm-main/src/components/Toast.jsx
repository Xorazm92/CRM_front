import React from "react";

const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        background: type === "success" ? "#4caf50" : "#f44336",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: 200,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

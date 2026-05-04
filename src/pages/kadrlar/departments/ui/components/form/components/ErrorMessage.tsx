import React from "react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
    {message}
  </span>
);


// src/components/ui/button.jsx
import React from "react";

export function Button({ children, onClick, variant = "default", disabled, className = "" }) {
  const baseStyle =
    "rounded-xl border font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700",
    outline: "bg-white border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

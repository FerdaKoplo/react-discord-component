import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, error, label, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div
          className={`
            flex items-center w-full border rounded-md overflow-hidden transition-colors bg-white
            focus-within:ring-2 focus-within:ring-green-200
            ${
              error
                ? "border-red-800 focus-within:border-red-800 focus-within:ring-red-800"
                : "border-gray-300 focus-within:border-green-200"
            }
            ${className}
          `}
        >
          {icon && (
            <>
              <div className="flex items-center justify-center px-3 py-2 text-gray-500 bg-gray-50">
                {icon}
              </div>

              <div className="w-px h-5 bg-gray-300" />
            </>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`
              w-full px-3 py-2 text-sm outline-none bg-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-xs text-red-800 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

export default Input;

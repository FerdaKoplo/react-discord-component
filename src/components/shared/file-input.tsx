import React, { forwardRef, useState } from "react";

export interface FileInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className = "",
      error,
      label,
      icon,
      placeholder = "Select a file...",
      id,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();
    const [fileName, setFileName] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileName(file ? file.name : "");

      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
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
            relative flex items-center w-full border rounded-md overflow-hidden transition-colors bg-white
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
            </>
          )}

          <div
            className={`px-3 py-2 text-sm truncate ${fileName ? "text-gray-900" : "text-gray-500"}`}
          >
            {fileName || placeholder}
          </div>

          <input
            id={inputId}
            ref={ref}
            type="file"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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

FileInput.displayName = "FileInput";

export default FileInput;

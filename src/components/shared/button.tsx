import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  className = "",
  icon,
  ...props
}) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2 w-full rounded-md transition-colors border-2 
        border-slate-200 bg-white px-4 py-2 font-mono font-medium text-gray-800
        hover:bg-slate-50  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;

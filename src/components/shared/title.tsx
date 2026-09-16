import type React from "react";

type TitleSize =
  | "sm"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

interface TitleProps {
  text: string;
  size?: TitleSize;
  className?: string;
}

const sizeClasses: Record<TitleSize, string> = {
  sm: "text-sm",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

const Title: React.FC<TitleProps> = ({ text, size = "3xl", className }) => {
  return (
    <h1 className={`font-mono font-bold ${sizeClasses[size]} ${className}`}>
      {text}
    </h1>
  );
};

export default Title;

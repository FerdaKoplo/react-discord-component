import React from "react";

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  imageClassName?: string;
}

const Frame: React.FC<FrameProps> = ({
  src,
  alt,
  className = "",
  imageClassName = "",
  ...props
}) => {
  return (
    <div
      className={`
        relative w-full rounded-lg border-2 border-slate-200
        overflow-hidden aspect-video flex items-center justify-center 
        ${className}
      `}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={`w-3/4 h-full object-contain drop-shadow-md ${imageClassName}`}
      />
    </div>
  );
};

export default Frame;

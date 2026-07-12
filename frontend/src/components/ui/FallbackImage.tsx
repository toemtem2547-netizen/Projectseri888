"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

interface FallbackImageProps extends ImageProps {
  fallbackIcon?: React.ReactNode;
}

export default function FallbackImage({
  src,
  alt,
  fallbackIcon,
  className,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-cv-deep border border-white/10 ${className}`}
      >
        {fallbackIcon || <Film className="w-8 h-8 text-white/20 mb-2" />}
        <span className="text-xs text-white/30 truncate max-w-[80%]">
          {alt || "No Image"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

"use client";

import Image from "next/image";
import { MouseEvent, useState } from "react";

export const ProductImageZoom = ({ alt, src }: { alt: string; src: string }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-soft"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMove}
    >
      <Image
        alt={alt}
        className="object-cover transition-transform duration-300"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        src={src}
        style={{
          transform: isZoomed ? "scale(1.65)" : "scale(1)",
          transformOrigin: `${position.x}% ${position.y}%`
        }}
      />
    </div>
  );
};

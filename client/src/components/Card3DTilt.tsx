import { useState, useRef, type ReactNode, type MouseEvent } from "react";

interface Card3DTiltProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  onClick?: () => void;
}

export default function Card3DTilt({
  children,
  className = "",
  maxTilt = 14,
  scale = 1.04,
  glare = true,
  onClick,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      glareX,
      glareY,
      glareOpacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: style.transform,
        transition: style.glareOpacity === 0 ? "transform 0.5s ease-out" : "transform 0.08s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden cursor-pointer ${className}`}
    >
      {children}

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,0.4) 0%, rgba(233,69,96,0.15) 30%, transparent 70%)`,
            opacity: style.glareOpacity,
          }}
        />
      )}
    </div>
  );
}

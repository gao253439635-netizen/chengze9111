import React, { useRef, useState, useEffect } from "react";

interface MagnetProps {
  children: React.ReactElement;
  padding?: number;
  strength?: number;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState("transform 0.6s ease-in-out");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elemX;
      const distanceY = e.clientY - elemY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < padding) {
        const moveX = distanceX / strength;
        const moveY = distanceY / strength;
        setTransform(`translate3d(${moveX}px, ${moveY}px, 0px)`);
        setTransition("transform 0.3s ease-out");
      } else {
        setTransform("translate3d(0px, 0px, 0px)");
        setTransition("transform 0.6s ease-in-out");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

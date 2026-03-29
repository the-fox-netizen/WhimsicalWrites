'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-neutral-400 pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePosition.x - 20,
        y: mousePosition.y - 20
      }}
      transition={{
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 30
      }}
    >
      <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
    </motion.div>
  );
}

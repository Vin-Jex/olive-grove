import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);
  const [outerCursorPosition, setOuterCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      setCursorPosition({ x: clientX, y: clientY });

      const timeoutId = setTimeout(() => {
        setOuterCursorPosition({ x: clientX, y: clientY });
      }, 200);

      return () => clearTimeout(timeoutId);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.matches("link, a, button, .hoverable")) {
          setIsHover(true);
        }
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.matches("link, a, button, .hoverable")) {
          setIsHover(false);
        }
      }
    };

    // Add mouse move listener to the window
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseEnter);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseEnter);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <div className='flex items-center justify-center !cursor-none'>
      <motion.div
        style={{
          position: "fixed",
          top: outerCursorPosition.y,
          left: outerCursorPosition.x,
          width: isHover ? "50px" : "40px",
          height: isHover ? "50px" : "40px",
          borderRadius: "50%",
          backgroundColor: "rgba(50, 168, 196, 0.1)",
          pointerEvents: "none",
          transform: isHover
            ? "translate(-25%, -25%)"
            : "translate(-30%, -30%)",
          zIndex: 9998,
          cursor: "none",
        }}
        animate={{
          width: isHover ? "50px" : "40px",
          height: isHover ? "50px" : "40px",
          transition: { duration: 0.3 },
        }}
      />

      {/* Inner Cursor */}
      <motion.div
        style={{
          cursor: "none",
          position: "fixed",
          top: cursorPosition.y,
          left: cursorPosition.x,
          width: isHover ? "25px" : "15px",
          height: isHover ? "25px" : "15px",
          borderRadius: "50%",
          backgroundColor: isHover ? "#32A8C4" : "#1E1E1E99",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          boxShadow: isHover
            ? "0 0 10px rgba(50, 168, 196, 0.5)"
            : "0 0 10px rgba(50, 168, 196, 0.2)",
        }}
        animate={{
          width: isHover ? "25px" : "15px",
          height: isHover ? "25px" : "15px",
          backgroundColor: isHover ? "#32A8C4" : "#32A8C4",
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 1.2 }}
        whileHover={{ scale: 1.1 }}
        transformTemplate={(values) => `translate(-50%, -50%) ${values}`}
      />
    </div>
  );
};

export default CustomCursor;

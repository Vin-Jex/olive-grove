import React, { FC } from "react";
import { TSideDialogContent } from "../utils/types";
import { motion, Variants } from "framer";

const SideDialog: FC<{ links: TSideDialogContent[]; className?: string }> = ({
  links,
  className,
}) => {
  const variants: Variants = {
    fade: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
  };

  return (
    <motion.div
      className={`rounded-md absolute top-0 bg-white p-3 flex flex-col gap-3 w-full min-w-[150px] shadow ${className}`}
      variants={variants}
      initial="fade"
      animate="show"
      exit="fade"
      transition={{ duration: 0.2 }}
    >
      {links.map((link, i) => (
        <>
          <span
            key={i}
            className={`flex gap-2.5 items-end cursor-pointer text-xs ${
              link.className || ""
            }`}
            onClick={() => link.action()}
          >
            {/* Icon */}
            {typeof link.icon === "string" ? (
              <i className={link.icon}></i>
            ) : (
              link.icon
            )}
            {/* Content */}
            {typeof link.title === "string" ? (
              <span>{link.title}</span>
            ) : (
              link.title
            )}
          </span>
        </>
      ))}
    </motion.div>
  );
};

export default SideDialog;

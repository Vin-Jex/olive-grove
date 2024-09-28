import React, {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "blue" | "outline" | "red" | "yellow";
  width?: "full" | "auto" | "fit";
}
const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  color = "blue",
  width = "auto",
  className,
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const sizeClassName = {
    xs: "px-2 md:px-2.5 lg:px-3 py-2 lg:py-2.5 text-xs md:text-sm font-medium",
    sm: "px-2 md:px-3 lg:px-4 py-2.5 lg:py-3 text-sm md:text-base font-medium",
    md: "px-2 sm:px-3.5 md:px-5 py-2.5 lg:py-3 text-lg font-medium",
    lg: "px-3 md:px-4 lg:px-6 py-2.5 lg:py-3 text-lg",
  }[size];

  const widthClassName = {
    full: "w-full",
    auto: "w-full max-w-[100px] md:max-w-[130px]",
    fit: "w-fit",
  }[width];

  const colorClassName = {
    blue: "bg-primary text-[#fdfdfd]", // bg of dark cyan-blue
    outline: `bg-transparent border border-subtext disabled:border-none text-[#1E1E1E]`, // bg of transparent
    red: "bg-red-500 !text-white", // bg of red
    yellow: "bg-yellow-500", // bg of yellow
  }[color];

  return (
    <button
      className={`flex items-center justify-center space-x-1 rounded-md font-roboto font-medium ${widthClassName} text-center ${sizeClassName} ${colorClassName} whitespace-nowrap disabled:text-[#F8F8F8D9] disabled:cursor-no-drop  disabled:bg-[#1E1E1E4D] cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

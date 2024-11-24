import React, { FC } from "react";
import error404Img from "@/images/404 error.png";
import Image from "next/image";

const NotFoundError: FC<{
  msg: string;
  img?: string;
  width?: number;
  height?: number;
}> = ({ msg, img, height, width }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 flex-col g-4">
      <Image
        src={img || error404Img.src}
        width={width || 250}
        height={height || 250}
        alt="404"
      />
      <span className="text-primary">{msg}</span>
    </div>
  );
};

export default NotFoundError;

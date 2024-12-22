import React, { FC } from "react";
import error404Img from "@/images/laptop-404.png";
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
        width={width || 300}
        height={height || 300}
        alt="404"
      />
      <br />
      <span className="text-subtext text-3xl">{msg}</span>
      <span className="text-subtext">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        The item you're searching for was not found
      </span>
    </div>
  );
};

export default NotFoundError;

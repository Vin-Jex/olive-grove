import React, { FC } from "react";
import error500Img from "@/images/500 error.png";
import Image from "next/image";

const ServerError: FC<{ msg: string }> = ({ msg }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 flex-col g-4">
      <Image src={error500Img.src} width={250} height={250} alt="500" />
      <span className="text-primary">{msg}</span>
    </div>
  );
};

export default ServerError;

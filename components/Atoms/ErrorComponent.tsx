import React, { FC } from "react";
import error404Img from "@/public/image/laptop-404.png";
import error500Img from "@/public/image/500 error.png";
import error403Img from "@/public/image/403 Error Forbidden-cuate.png";
import error401Img from "@/public/image/401-error-removebg-preview.png";
import Image from "next/image";
import { TErrorStatus } from "../utils/types";

const ErrorUI: FC<{
  msg?: string;
  img?: string;
  width?: number;
  height?: number;
  status: TErrorStatus;
}> = ({ msg, img, height, width, status }) => {
  return (
    <div className='w-full h-full flex items-center justify-center p-4 flex-col'>
      <Image
        src={
          img ||
          (status === 404
            ? error404Img.src
            : status === 500
            ? error500Img.src
            : status === 403
            ? error403Img.src
            : error401Img.src)
        }
        width={width || 350}
        height={height || 350}
        alt={status?.toString()}
      />
      <br />
      <span className='text-center text-subtext text-lg max-w-[70%]'>
        {msg ||
          (status === 404
            ? "Item not found"
            : status === 401
            ? "Not authorized"
            : status === 500
            ? "Server error"
            : "Not permitted")}
      </span>
      <span className='text-subtext text-sm'>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        {status === 404
          ? "The item you're searching for was not found"
          : status === 500
          ? "An error occurred while processing your request"
          : status === 401
          ? "You're not authorized to access this page"
          : "You don't have permission to access this page"}
      </span>
    </div>
  );
};

export default ErrorUI;

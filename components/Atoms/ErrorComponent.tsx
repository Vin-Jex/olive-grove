import React, { FC } from "react";
import error404Img from "@/images/laptop-404.png";
import error500Img from "@/images/500 error.png";
import error403Img from "@/images/403 Error Forbidden-cuate.png";
import error401Img from "@/images/401-error-removebg-preview.png";
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
    <div className="w-full h-full flex items-center justify-center p-4 flex-col g-4">
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
        width={width || 300}
        height={height || 300}
        alt={status?.toString()}
      />
      <br />
      <span className="text-subtext text-3xl">
        {msg ||
          (status === 404
            ? "Item not found"
            : status === 401
            ? "Not authorized"
            : status === 500
            ? "Server error"
            : "Not permitted")}
      </span>
      <span className="text-subtext">
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

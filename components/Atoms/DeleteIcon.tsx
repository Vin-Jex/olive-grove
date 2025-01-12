import React, { FC } from "react";

const DeleteIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.16602 21.5C3.52435 21.5 2.97524 21.2717 2.51868 20.8152C2.06213 20.3586 1.83346 19.8091 1.83268 19.1667V4H0.666016V1.66667H6.49935V0.5H13.4993V1.66667H19.3327V4H18.166V19.1667C18.166 19.8083 17.9377 20.3578 17.4812 20.8152C17.0246 21.2725 16.4751 21.5008 15.8327 21.5H4.16602ZM15.8327 4H4.16602V19.1667H15.8327V4ZM6.49935 16.8333H8.83268V6.33333H6.49935V16.8333ZM11.166 16.8333H13.4993V6.33333H11.166V16.8333Z"
        fill="#1E1E1E99"
        fill-opacity="0.6"
      />
    </svg>
  );
};

export default DeleteIcon;

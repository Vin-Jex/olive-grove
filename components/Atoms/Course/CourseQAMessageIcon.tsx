function MessageIcon({ commentNumber }: { commentNumber: number }) {
  return (
    <button className="flex  items-center">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 10C2.5 5.85787 5.85787 2.5 10 2.5C14.1422 2.5 17.5 5.85787 17.5 10C17.5 14.1422 14.1422 17.5 10 17.5C8.76033 17.5 7.59087 17.1992 6.56067 16.6667C5.91822 16.3346 3.43407 17.9957 2.91667 17.5C2.40582 17.0107 3.85992 14.3664 3.50337 13.75C2.86523 12.6468 2.5 11.3661 2.5 10Z"
          stroke="#3C413C"
          strokeOpacity="0.8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66699 11.6667H13.3337"
          stroke="#3C413C"
          strokeOpacity="0.8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66699 8.33325H13.3337"
          stroke="#3C413C"
          strokeOpacity="0.8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="leading-3 pl-2">{commentNumber.toLocaleString()}</span>
    </button>
  );
}

export default MessageIcon;

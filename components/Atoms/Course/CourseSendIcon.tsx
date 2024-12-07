function SendIcon({ className }: { className: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="30" rx="15" fill="#32A8C4" fill-opacity="0.1" />
      <g clip-path="url(#clip0_1182_3065)">
        <path
          d="M21.1759 10.2644C21.4999 9.3682 20.6314 8.4997 19.7352 8.82445L8.78142 12.7859C7.88217 13.1114 7.77342 14.3384 8.60067 14.8177L12.0972 16.8419L15.2194 13.7197C15.3609 13.5831 15.5503 13.5075 15.747 13.5092C15.9436 13.5109 16.1317 13.5898 16.2708 13.7288C16.4098 13.8679 16.4887 14.056 16.4904 14.2526C16.4921 14.4493 16.4165 14.6387 16.2799 14.7802L13.1577 17.9024L15.1827 21.3989C15.6612 22.2262 16.8882 22.1167 17.2137 21.2182L21.1759 10.2644Z"
          fill="#32A8C4"
        />
      </g>
      <defs>
        <clipPath id="clip0_1182_3065">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(6 6)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SendIcon;

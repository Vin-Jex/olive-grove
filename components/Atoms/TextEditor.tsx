import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TextEditor: React.FC<{
  placeholder: string;
  value: string;
  onChange: any;
}> = ({ placeholder, value, onChange, ...inputProps }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <div className='!relative'>
      <ReactQuill
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        modules={modules}
        theme='snow'
        className={`bg-transparent !border-[1px] !border-dark/80 outline-none !font-inter rounded-md w-full h-[300px] text-dark/80  placeholder:!text-dark/80 first-letter:placeholder:capitalize text-[14px] sm:text-[19px] resize-none !overflow-scroll`}
        {...inputProps}
      />
    </div>
  );
};

export default TextEditor;

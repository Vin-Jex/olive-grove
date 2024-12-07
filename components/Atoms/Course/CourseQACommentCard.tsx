import Image from "next/image";
import MessageIcon from "./CourseQAMessageIcon";
import dummyImage from "@/images/dummy-img.jpg";

function CommentCard() {
  return (
    <div className="py-5 border-b pb- space-y-7">
      <div className="grid items-center grid-cols-[40px_1fr] gap-4">
        <div className="rounded-full  border overflow-hidden  w-[40px] h-[40px]">
          <Image
            src={dummyImage.src}
            className=" h-full w-full"
            width={40}
            height={40}
            alt="student profile"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-dark font-roboto font-medium text-sm">
            Student Name
            <span className=" text-subtext"> • 5h ago</span>
          </span>
          <span className="text-subtext text-sm">
            Mrs. Elle is the best math teacher everrrs
          </span>
        </div>
      </div>
      <div className="px-5 ">
        <MessageIcon commentNumber={5} />
      </div>
    </div>
  );
}

export default CommentCard;

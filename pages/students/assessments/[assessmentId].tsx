import { useRouter } from "next/router";
import StudentWrapper from "@/components/Molecules/Layouts/Student.Layout";
import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Atoms/Button";
import withAuth from "@/components/Molecules/WithAuth";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { BackButton } from "../lectures/[courseId]";
import axiosInstance from "@/components/utils/axiosInstance";
import { baseUrl } from "@/components/utils/baseURL";
import Input from "@/components/Atoms/Input";
import Loader from "@/components/Atoms/Loader";
import { TQuestionCard } from "@/components/utils/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const CustomWrongIcon = () => {
  return (
    <svg
      className='h-4'
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='1'
        y='1'
        width='20'
        height='20'
        rx='10'
        stroke='#FF3B3B'
        strokeWidth='2'
      />
      <rect
        x='3'
        y='3'
        width='16'
        height='16'
        rx='8'
        fill='#FF3B3B'
        fillOpacity='0.4'
      />
    </svg>
  );
};

enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  PARAGRAGH = "paragraph",
  FILE_UPLOAD = "file_upload",
}

const CustomRightIcon = (props: { className?: string }) => {
  return (
    <svg
      className={`${props.className} h-4`}
      width='22'
      height='22'
      viewBox='0 0 22 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='1'
        y='1'
        width='20'
        height='20'
        rx='10'
        stroke='#32A8C4'
        strokeWidth='2'
      />
      <rect x='4' y='4' width='14' height='14' rx='7' fill='#32A8C4' />
      <rect
        x='4'
        y='4'
        width='14'
        height='14'
        rx='7'
        stroke='#32A8C4'
        strokeWidth='2'
      />
    </svg>
  );
};

const AssessmentDetailsPage = () => {
  const router = useRouter();
  const [startExercise, setStartExercise] = useState(false);
  const [answersReview, setAnswersReview] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<TQuestionCard | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [currentQxtIndex, setCurrentQxtIndex] = useState(() => {
    const index = localStorage.getItem("currentQxtIndex");
    return index ? index : "";
  });

  const [answeredQxts, setAnsweredQxts] = useState<Record<string, string>>(
    () => {
      const answeredQxts = localStorage.getItem("answeredQxts");
      console.log(answeredQxts, "answeredQxts");
      return answeredQxts !== "undefined" && answeredQxts
        ? JSON.parse(answeredQxts)
        : {};
    }
  );
  // const [fileUploadAnswers, setFileUploadAnswers] = useState<Record<
  //   string,
  //   Blob | File
  // > | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance(
          `${baseUrl}/api/v2/assessments/${router.query.assessmentId}`
        );
        setQuizQuestions(response.data.data);
      } catch (err) {
        //error fetching quiz questions
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [router]);

  // const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem("currentQxtIndex", currentQxtIndex.toString());
    localStorage.setItem("answeredQxts", JSON.stringify(answeredQxts));
  }, [currentQxtIndex, answeredQxts]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "The quiz duration is still ongoing";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!router.query.assessmentId) return; //don't proceed if there is no assessmentId
    // const formData = new FormData();
    const formData = {
      academicWeek: quizQuestions?.academicWeek._id,
      answers: [] as { questionId: string; answer: string }[],
    };
    // Check if all questions are answered
    // if (!fileUploadAnswers) {
    //   alert('Please answer all questions before submitting');
    //   return;
    // }
    if (Object.keys(answeredQxts).length !== quizQuestions?.questions?.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    Object.entries(answeredQxts).forEach(([qxtId, answer]) => {
      formData.answers.push({
        questionId: qxtId,
        answer,
      });
    });

    // if (fileUploadAnswers)
    //   Object.entries(fileUploadAnswers).forEach(([qxtId, file]) => {
    //     formData.answers.push({
    //       questionId: qxtId,
    //       answer, //image string
    //     });
    //   });

    //* Functionality to submit the answers to the server

    try {
      setIsSubmitLoading(true);
      const res = await axiosInstance.post(
        `${baseUrl}/api/v2/assessments/${router.query.assessmentId}/submit`,
        JSON.stringify(formData)
      );

      toast.success(
        res.data?.data?.message || "Assessment submitted successfully"
      );
      setIsQuizComplete(true);
      setAnsweredQxts({});
      localStorage.setItem("answeredQxts", JSON.stringify({}));
    } catch (error: AxiosError | any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to submit assessment"
      );
    } finally {
      setIsSubmitLoading(false);
    }

    // Check if all answers are correct
    //* In the case that tha answeres to the questions are sent.
    /** 
    const score = Object.keys(answeredQxts).reduce((acc, qxtId) => {
      const qxt = questions.find((q) => q.id.toString() === qxtId);
      if (qxt?.answer === answeredQxts[qxtId]) {
        return acc + 1;
      }
      return acc;
    }, 0);

    alert(`You scored ${score} out of ${questions.length}`);
    **/
  }

  // useEffect(() => {
  //   const makeOnline = () => setIsOnline(true);
  //   const makeOffline = () => setIsOnline(false);
  //   window.addEventListener('online', makeOnline);
  //   window.addEventListener('offline', makeOffline);

  //   return () => {
  //     window.removeEventListener('online', makeOnline);
  //     window.removeEventListener('offline', makeOffline);
  //   };
  // }, []);

  const resetQuiz = () => {
    // Clear local storage and reset state
    localStorage.removeItem("quizCurrentQuestion");
    localStorage.removeItem("quizSelectedAnswers");
    localStorage.removeItem("quizScore");

    setCurrentQxtIndex("");
    setAnsweredQxts({});
    setIsQuizComplete(false);
  };

  return (
    <StudentWrapper
      remark='Assessment'
      title='Olive Grove - Assessment'
      metaTitle={`Olive Grove - ${
        quizQuestions?.course?.title ?? ""
      } assessment`}
    >
      {isLoading && <Loader />}
      {isQuizComplete && <SubmissionCard quizQuestions={quizQuestions} />}
      {quizQuestions && !isQuizComplete && (
        <div className='sm:mx-11 mx-5 py-4 font-roboto sm:max-w-[60vw]'>
          <BreadCrumb title={quizQuestions?.course?.title} />
          <div className=' py-8 px-6  rounded-lg bg-[#32A8C4] bg-opacity-10 w-full'>
            <h2 className='text-3xl py-5'>
              {quizQuestions?.course?.title} Class Exercise
            </h2>
            <div className='max-sm:flex-col max-sm:gap-3 flex justify-between'>
              <span>
                <strong>Topic:</strong> {quizQuestions?.course?.title}
              </span>
              <span>
                <strong>Due:</strong>{" "}
                {new Date(quizQuestions?.dueDate)
                  .toLocaleDateString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replaceAll("/", "-")}
                ,{" "}
                {new Date(quizQuestions?.dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {!startExercise ? (
            <div className=' px-5'>
              <p className='py-6'>{quizQuestions?.description}</p>
              <p className='py-6'>Click on the button below to begin.</p>
              <Button
                onClick={() => setStartExercise((c) => !c)}
                color='blue'
                size='xs'
              >
                Start Exercise
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='mt-10'>
              <div className='py-5 flex flex-col space-y-10'>
                {/* {answersReview &&
                markedQuestions.map((question, i) => (
                  <QuestionCard
                    review={true}
                    saveUpload={setFileUploadAnswers}
                    value={question.yourAnswer!}
                    setCurrentQxtIndex={setCurrentQxtIndex}
                    setAnsweredQxts={setAnsweredQxts}
                    key={i}
                    i={i}
                    question={question}
                  />
                ))} */}

                {!answersReview &&
                  quizQuestions?.questions?.map((question, i) => (
                    <QuestionCard
                      answeredQxts={answeredQxts}
                      // saveUpload={setFileUploadAnswers}
                      review={false}
                      value={answeredQxts[question._id.toString()] ?? null}
                      setCurrentQxtIndex={setCurrentQxtIndex}
                      setAnsweredQxts={setAnsweredQxts}
                      key={i}
                      i={i}
                      question={question}
                    />
                  ))}
              </div>
              {!answersReview && (
                <Button type='submit' size='sm' className='text-left my-4 mb-7'>
                  {isSubmitLoading ? (
                    <CircularProgress size={20} color='inherit' />
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </form>
          )}
        </div>
      )}
      {/* <SubmissionCard /> */}
    </StudentWrapper>
  );
};
//* This is me assuming the strucure of the returned assessment object

function QuestionCard({
  question,
  i,
  value,
  review,
  // ref,
  answeredQxts,
  // saveUpload,
  setCurrentQxtIndex,
  setAnsweredQxts,
}: {
  // question: TQuestionCard;
  question: TQuestionCard["questions"][0];
  value: string;
  i: number;
  // saveUpload: React.Dispatch<
  //   React.SetStateAction<Record<string, Blob | File> | null>
  // >;
  answeredQxts?: Record<string, string>;
  review: boolean;
  setCurrentQxtIndex: React.Dispatch<React.SetStateAction<string>>;
  setAnsweredQxts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <div className='bg-white p-10 rounded-2xl'>
      <FormControl style={{ width: "100%" }}>
        <FormLabel
          style={{
            fontSize: 18,
            fontWeight: "normal",
            width: "100%",
            color: "black",
            marginBlockEnd: 24,
          }}
          id='demo-radio-buttons-group-label'
        >
          {i + 1}.
          {/* {question.img && (
            <div className='pb-2'>
              <Image
                src={question.img}
                width={300}
                height={300}
                alt={question.question}
              />
            </div>
          )} */}
          {question.questionText}
        </FormLabel>
        <RadioGroup
          style={{ width: "100%" }}
          value={value}
          onChange={(e) => {
            const selected = { [question._id.toString()]: e.target.value };
            setCurrentQxtIndex(question._id.toString());
            setAnsweredQxts((prev) => ({
              ...prev,
              ...selected,
            }));
          }}
          aria-labelledby='demo-radio-buttons-group-label'
          name='radio-buttons-group'
        >
          {question.questionType === QuestionType.MULTIPLE_CHOICE &&
            question.options.map((option, i) => (
              <div
                key={option + i}
                className='flex w-full items-center !text-subtext'
              >
                <FormControlLabel
                  style={
                    review
                      ? option === question.correctAnswer
                        ? {
                            height: "32px",
                            width: "50%",
                            paddingInlineEnd: 17,
                            textOverflow: "ellipsis",
                            paddingBlock: 2,
                            backgroundColor: "#cbf5ff",
                            marginLeft: -3,
                            fillOpacity: 0.6,
                            borderRadius: 5,
                            marginBlock: 7,
                          }
                        : option === question.yourAnswer &&
                          option !== question.correctAnswer
                        ? {
                            height: "32px",
                            width: "50%",
                            paddingInlineEnd: 17,
                            paddingBlock: 2,
                            marginLeft: -3,
                            backgroundColor: "#fdd9d9",
                            fillOpacity: 0.6,
                            borderRadius: 5,
                            marginBlock: 7,
                          }
                        : { marginInline: review ? -10 : -15 }
                      : {
                          marginInline: review
                            ? -10
                            : option === question.yourAnswer
                            ? -15
                            : 0,
                        }
                  }
                  value={option}
                  control={
                    <Radio
                      checkedIcon={
                        option === question.correctAnswer ? (
                          <CustomRightIcon />
                        ) : option === question.yourAnswer &&
                          option !== question.correctAnswer ? (
                          <CustomWrongIcon />
                        ) : (
                          !review && <CustomRightIcon className='!h-5' />
                        )
                      }
                    />
                  }
                  key={question._id}
                  label={option}
                />
                <span className='-ml-3'>
                  {review &&
                  question.yourAnswer === question.correctAnswer &&
                  option === question.correctAnswer ? (
                    <CorrectCheckMark />
                  ) : null}
                </span>
                <span>
                  {review &&
                  question.yourAnswer !== question.correctAnswer &&
                  option === question.yourAnswer ? (
                    <WrongCrossMark />
                  ) : null}
                </span>
              </div>
            ))}
        </RadioGroup>
        {question.questionType === QuestionType.PARAGRAGH && (
          <Input
            type='text'
            disabled={review}
            value={
              review ? question.yourAnswer : answeredQxts?.[question._id] ?? ""
            }
            className='!border-b !border-l-0 !border-r-0 !border-t-0 rounded-none w-1/2 border-black bg-white py-1'
            onChange={(e) => {
              const selected = { [question._id.toString()]: e.target.value };
              setCurrentQxtIndex(question._id.toString());
              setAnsweredQxts((prev) => ({
                ...prev,
                ...selected,
              }));
            }}
          />
        )}
        {question.questionType === QuestionType.FILE_UPLOAD && (
          <>
            <label
              htmlFor={question._id.toString()}
              className='rounded-lg cursor-pointer border px-4 text-subtext w-fit py-2'
            >
              Choose a file
            </label>
            <Input
              type='file'
              id={question._id.toString()}
              accept='image/*'
              disabled={review}
              value={review ? question.yourAnswer : undefined}
              className=' w-1/2 border-black bg-white py-1 hidden'
              onChange={async (e) => {
                const formData = new FormData();
                formData.append("files", e.target.files?.[0]!);
                formData.append("type", "image");
                //we want to firsr upload the file to the server and get the url
                //then save the url in the state
                try {
                  const response = await axiosInstance.post(
                    `${baseUrl}/files/upload`,
                    formData
                  );
                  const selected = {
                    [question._id.toString()]: response.data.data.fileUrl,
                  };
                  setCurrentQxtIndex(question._id.toString());
                  setAnsweredQxts((prev) => ({
                    ...prev,
                    ...selected,
                  }));
                  // saveUpload((prev) => ({
                  //   ...prev,
                  //   ...selected,
                  // }));
                } catch (err: AxiosError | any) {
                  toast.error(
                    err.response?.data?.message ||
                      "An error occurred when uploading the file, reupload the file"
                  );
                }

                //get the url of the uploaded i
              }}
            />
          </>
        )}
      </FormControl>
    </div>
  );
}

function SubmissionCard({
  quizQuestions,
}: {
  quizQuestions: TQuestionCard | null;
}) {
  return (
    <div className=''>
      <div className='mx-11'>
        <BreadCrumb title={quizQuestions?.course?.title ?? ""} />
      </div>
      <div className=' py-7 px-6 mx-11 max-w-[60vw] space-y-4 rounded-lg bg-[#32A8C4] bg-opacity-10 w-full'>
        <div>
          <svg
            width='40'
            height='40'
            viewBox='0 0 58 58'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect width='58' height='58' rx='29' fill='#32A8C4' />
            <path
              d='M24.5002 35.255L19.2952 30.05C19.0148 29.7695 18.6344 29.612 18.2377 29.612C17.8411 29.612 17.4607 29.7695 17.1802 30.05C16.8998 30.3305 16.7422 30.7109 16.7422 31.1075C16.7422 31.3039 16.7809 31.4984 16.856 31.6798C16.9312 31.8613 17.0413 32.0261 17.1802 32.165L23.4502 38.435C24.0352 39.02 24.9802 39.02 25.5652 38.435L41.4352 22.565C41.7157 22.2845 41.8732 21.9041 41.8732 21.5075C41.8732 21.1109 41.7157 20.7305 41.4352 20.45C41.1548 20.1695 40.7744 20.012 40.3777 20.012C39.9811 20.012 39.6007 20.1695 39.3202 20.45L24.5002 35.255Z'
              fill='#F8F8F8'
            />
          </svg>
        </div>
        <h2 className='text-3xl py-2'>Exercise Submitted Successfully</h2>
        <div className='flex justify-between text-lg text-subtext py-3'>
          You have successfully submitted the Physics class exercise. The
          results will be sent to you in a few hours. Keep your eyes open!
        </div>
        <Button color='blue' className='mt-4 !px-6' size='xs'>
          Back to Assessment
        </Button>
      </div>
    </div>
  );
}

function BreadCrumb(props: { title: string }) {
  return (
    <div className='flex gap-4 items-center'>
      <div className='mt-4'>
        <BackButton />
      </div>
      {/* bread crumb */}
      <div className='flex py-7 mt-4 items-center space-x-2'>
        <Link href='/students/assessments'>
          <span className='text-gray pr-2'>Assessments </span>
        </Link>{" "}
        / <span className='text-primary'>{props.title}</span>
      </div>
    </div>
  );
}

// const questions: TQuestionCard[] = [
//   {
//     id: 1,
//     questionType: 'mcq',
//     question: 'What is Displacement',
//     options: ['HTML', 'CSS', 'JavaScript'],
//   },
//   {
//     id: 2,
//     questionType: 'mcq',
//     question: 'What is Velocity',
//     options: ['Python', 'Java', 'C++'],
//   },
//   {
//     id: 3,
//     img: TestImage,
//     questionType: 'mcq',
//     question: 'What is Acceleration',
//     options: ['Ruby', 'PHP', 'Swift'],
//   },
//   {
//     id: 4,
//     question: 'What is Force',
//     questionType: 'mcq',
//     options: ['C#', 'TypeScript', 'Go'],
//   },
//   {
//     id: 5,
//     questionType: 'mcq',
//     question: 'What is Energy',
//     options: ['Rust', 'Kotlin', 'Scala'],
//   },
//   {
//     id: 6,
//     questionType: 'german',
//     question: 'Why did your parents give you your name?',
//   },
//   {
//     id: 7,
//     questionType: 'image_upload',
//     question:
//       'With the aid of a diagram explain the process of photosynthesis?',
//   },
// ];

// const markedQuestions: TQuestionCard[] = [
//   {
//     id: 1,
//     questionType: 'mcq',
//     question: 'What is Displacement',
//     options: ['HTML', 'CSS', 'JavaScript'],
//     yourAnswer: 'HTML',
//     correctAnswer: 'HTML',
//   },
//   {
//     id: 2,
//     questionType: 'mcq',
//     question: 'What is Velocity',
//     options: ['Python', 'Java', 'C++'],
//     yourAnswer: 'Python',
//     correctAnswer: 'Java',
//   },
//   {
//     id: 3,
//     questionType: 'mcq',
//     question: 'What is Acceleration',
//     img: TestImage,
//     options: ['Ruby', 'PHP', 'Swift'],
//     yourAnswer: 'Swift',
//     correctAnswer: 'Swift',
//   },
//   {
//     id: 4,
//     questionType: 'mcq',
//     question: 'What is Force',
//     options: ['C#', 'TypeScript', 'Go'],
//     yourAnswer: 'C#',
//     correctAnswer: 'TypeScript',
//   },
//   {
//     id: 5,
//     questionType: 'mcq',
//     question: 'What is Energy',
//     options: ['Rust', 'Kotlin', 'Scala'],
//     yourAnswer: 'Kotlin',
//     correctAnswer: 'Scala',
//   },
//   {
//     id: 6,
//     questionType: 'german',
//     question: 'Why did your parents give you your name?',
//     yourAnswer: 'Man of Money',
//   },
// ];

const CorrectCheckMark = () => {
  return (
    <svg
      width='36'
      height='36'
      className={`h-6 `}
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13.5002 24.255L8.29522 19.05C8.01475 18.7695 7.63436 18.612 7.23772 18.612C6.84108 18.612 6.46068 18.7695 6.18022 19.05C5.89975 19.3305 5.74219 19.7109 5.74219 20.1075C5.74219 20.3039 5.78087 20.4984 5.85603 20.6798C5.93119 20.8613 6.04135 21.0261 6.18022 21.165L12.4502 27.435C13.0352 28.02 13.9802 28.02 14.5652 27.435L30.4352 11.565C30.7157 11.2845 30.8732 10.9041 30.8732 10.5075C30.8732 10.1109 30.7157 9.73046 30.4352 9.44999C30.1548 9.16953 29.7744 9.01196 29.3777 9.01196C28.9811 9.01196 28.6007 9.16953 28.3202 9.44999L13.5002 24.255Z'
        fill='#32A8C4'
      />
    </svg>
  );
};

const WrongCrossMark = () => {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      className='h-3'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1.13672 16.8645L9.00122 9L16.8657 16.8645M16.8657 1.1355L8.99972 9L1.13672 1.1355'
        stroke='#FF3B3B'
        strokeOpacity='0.4'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

// export default AssessmentDetailsPage;

export default withAuth("Student", AssessmentDetailsPage);

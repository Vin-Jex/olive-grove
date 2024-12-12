import { useRouter } from 'next/router';
import StudentWrapper from '@/components/Molecules/Layouts/Student.Layout';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import img from '@/public/image/tutor.png';
import Link from 'next/link';
import Button from '@/components/Atoms/Button';
import withAuth from '@/components/Molecules/WithAuth';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { BackButton } from '../lectures/[subjectId]';
import axiosInstance from '@/components/utils/axiosInstance';
import { baseUrl } from '@/components/utils/baseURL';

const AssessmentDetailsPage = () => {
  const router = useRouter();
  const [startExercise, setStartExercise] = useState(false);
  const [answersReview, setAnswersReview] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<TQuestionCard[]>([]);

  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [currentQxtIndex, setCurrentQxtIndex] = useState(() => {
    const index = localStorage.getItem('currentQxtIndex');
    return index ? index : '';
  });

  const [answeredQxts, setAnsweredQxts] = useState<Record<string, string>>(
    () => {
      const answeredQxts = localStorage.getItem('answeredQxts');
      console.log(answeredQxts, 'answeredQxts');
      return answeredQxts !== 'undefined' && answeredQxts
        ? JSON.parse(answeredQxts)
        : {};
    }
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance(
          `${baseUrl}/student/assessments/{assessmentId}`
        );
        setQuizQuestions(response.data);
      } catch (err) {
        //error fetching quiz questions
        console.error(err);
      }
    };
  }, []);

  // const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    localStorage.setItem('currentQxtIndex', currentQxtIndex.toString());
    localStorage.setItem('answeredQxts', JSON.stringify(answeredQxts));
  }, [currentQxtIndex, answeredQxts]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'The quiz duration is still ongoing';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  async function handleSubmit() {
    // Check if all questions are answered
    if (Object.keys(answeredQxts).length !== questions.length) {
      alert('Please answer all questions before submitting');
      return;
    }

    //* Functionality to submit the answers to the server

    try {
      const res = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answeredQxts),
      });

      if (!res.ok) {
        throw new Error('Failed to submit answers');
      }
      const data = await res.json();
      console.log(data);
      alert('Answers submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit answers');
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
    setAnsweredQxts({});
    localStorage.setItem('answeredQxts', JSON.stringify({}));
    setIsQuizComplete(true);
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
    localStorage.removeItem('quizCurrentQuestion');
    localStorage.removeItem('quizSelectedAnswers');
    localStorage.removeItem('quizScore');

    setCurrentQxtIndex('');
    setAnsweredQxts({});
    setIsQuizComplete(false);
  };

  const { assessmentId } = router.query;

  return (
    <StudentWrapper
      title={`Assessment`}
      metaTitle={`Olive Groove ~ ${assessmentId} assessment`}
    >
      <div className='mx-11 max-w-[60vw]'>
        <div className='flex gap-4 items-center'>
          <div className='mt-4'>
            <BackButton />
          </div>
          {/* bread crumb */}
          <div className='flex py-7 mt-4 items-center space-x-2'>
            <Link href='/students/assessments'>
              <span className='text-gray pr-2'>Assessments </span>
            </Link>{' '}
            / <span className='text-primary'>{assessmentId}</span>
          </div>
        </div>
        <div className=' py-4 px-6  rounded-lg bg-[#32A8C4] bg-opacity-10 w-full'>
          <h2 className='text-3xl py-5'>Physics Class Exercise</h2>
          <div className='flex justify-between'>
            <span>
              <strong>Topic:</strong> Fundamentals of Motion
            </span>
            <span>
              <strong>Due:</strong> 20-11-2024, 9:30AM
            </span>
          </div>
        </div>
        {!startExercise ? (
          <div className=' px-5'>
            <p className='py-6'>
              This midterm test is a multiple-choice type of exam made up of 5
              questions with options. Ensure to attempt all questions and finish
              before the time is up. You have 25minutes.
            </p>
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
          <div>
            <div className='py-5 flex flex-col space-y-10'>
              {answersReview &&
                markedQuestions.map((question, i) => (
                  <QuestionCard
                    review={true}
                    value={question.yourAnswer!}
                    setCurrentQxtIndex={setCurrentQxtIndex}
                    setAnsweredQxts={setAnsweredQxts}
                    key={i}
                    i={i}
                    question={question}
                  />
                ))}

              {!answersReview &&
                questions.map((question, i) => (
                  <QuestionCard
                    review={false}
                    value={answeredQxts[question.id.toString()] ?? ''}
                    setCurrentQxtIndex={setCurrentQxtIndex}
                    setAnsweredQxts={setAnsweredQxts}
                    key={i}
                    i={i}
                    question={question}
                  />
                ))}
            </div>
            {!answersReview && (
              <Button
                onClick={handleSubmit}
                size='sm'
                className='text-left my-4 mb-7'
              >
                Submit
              </Button>
            )}
          </div>
        )}
      </div>
      {/* <SubmissionCard /> */}
    </StudentWrapper>
  );
};
//* This is me assuming the strucure of the returned assessment object
type TQuestionCard = {
  id: number;
  question: string;
  options: string[];
  yourAnswer?: string;
  correctAnswer?: string;
  answer?: string;
};

function QuestionCard({
  question,
  i,
  value,
  review,

  setCurrentQxtIndex,
  setAnsweredQxts,
}: {
  question: TQuestionCard;
  value: string;
  i: number;
  review: boolean;

  setCurrentQxtIndex: React.Dispatch<React.SetStateAction<string>>;
  setAnsweredQxts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  return (
    <FormControl>
      <FormLabel style={{ fontSize: 18 }} id='demo-radio-buttons-group-label'>
        {i + 1}. {question.question}
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => {
          const selected = { [question.id.toString()]: e.target.value };
          setCurrentQxtIndex(question.id.toString());
          setAnsweredQxts((prev) => ({
            ...prev,
            ...selected,
          }));
        }}
        aria-labelledby='demo-radio-buttons-group-label'
        name='radio-buttons-group'
      >
        {question.options.map((option, i) => (
          <div key={option + i} className='flex items-center'>
            <FormControlLabel
              style={
                review
                  ? option === question.correctAnswer
                    ? {
                        height: '28px',
                        width: 'fit-content',
                        paddingInlineEnd: 17,
                        paddingBlock: 2,
                        backgroundColor: '#7ecee1',
                        fillOpacity: 0.6,
                        borderRadius: 5,
                        marginBlock: 7,
                      }
                    : option === question.yourAnswer &&
                      option !== question.correctAnswer
                    ? {
                        height: '28px',
                        width: 'fit-content',
                        paddingInlineEnd: 17,
                        paddingBlock: 2,
                        backgroundColor: '#e8a9a9',
                        fillOpacity: 0.6,
                        borderRadius: 5,
                        marginBlock: 7,
                      }
                    : {}
                  : {}
              }
              value={option}
              control={
                <Radio
                  // disabled={review}
                  color={
                    review && option === question.correctAnswer
                      ? 'success'
                      : 'error'
                  }
                />
              }
              key={i}
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
    </FormControl>
  );
}

function SubmissionCard() {
  return (
    <div className=' py-7 px-6 mx-11  max-w-[60vw]  space-y-4 rounded-lg bg-[#32A8C4] bg-opacity-10 w-full'>
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
      <h2 className='text-3xl py-5'>Exercise Submitted Successfully</h2>
      <div className='flex justify-between py-3'>
        You have successfully submitted the Physics class exercise. The results
        will be sent to you in a few hours. Keep your eyes open!
      </div>
      <Button color='blue' className='mt-4' size='xs'>
        Back to Assessment
      </Button>
    </div>
  );
}

const questions: TQuestionCard[] = [
  {
    id: 1,
    question: 'What is Displacement',
    options: ['HTML', 'CSS', 'JavaScript'],
    answer: 'HTML',
  },
  {
    id: 2,
    question: 'What is Velocity',
    options: ['Python', 'Java', 'C++'],
    answer: 'Java',
  },
  {
    id: 3,
    question: 'What is Acceleration',
    options: ['Ruby', 'PHP', 'Swift'],
    answer: 'Swift',
  },
  {
    id: 4,
    question: 'What is Force',
    options: ['C#', 'TypeScript', 'Go'],
    answer: 'TypeScript',
  },
  {
    id: 5,
    question: 'What is Energy',
    options: ['Rust', 'Kotlin', 'Scala'],
    answer: 'Kotlin',
  },
];

const markedQuestions: TQuestionCard[] = [
  {
    id: 1,
    question: 'What is Displacement',
    options: ['HTML', 'CSS', 'JavaScript'],
    yourAnswer: 'HTML',
    correctAnswer: 'HTML',
  },
  {
    id: 2,
    question: 'What is Velocity',
    options: ['Python', 'Java', 'C++'],
    yourAnswer: 'Python',
    correctAnswer: 'Java',
  },
  {
    id: 3,
    question: 'What is Acceleration',
    options: ['Ruby', 'PHP', 'Swift'],
    yourAnswer: 'Swift',
    correctAnswer: 'Swift',
  },
  {
    id: 4,
    question: 'What is Force',
    options: ['C#', 'TypeScript', 'Go'],
    yourAnswer: 'C#',
    correctAnswer: 'TypeScript',
  },
  {
    id: 5,
    question: 'What is Energy',
    options: ['Rust', 'Kotlin', 'Scala'],
    yourAnswer: 'Kotlin',
    correctAnswer: 'Scala',
  },
];

const CorrectCheckMark = () => {
  return (
    <svg
      width='36'
      height='36'
      className='h-6'
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
        stroke-opacity='0.4'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

// export default AssessmentDetailsPage;


export default withAuth('Student', AssessmentDetailsPage);

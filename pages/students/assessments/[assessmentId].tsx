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

const AssessmentDetailsPage = () => {
  const router = useRouter();
  const [startExercise, setStartExercise] = useState(false);
  const [answersReview, setAnswersReview] = useState(true);

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
    console.log(answeredQxts);
  }, [answeredQxts]);

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
        <div className=' py-4 px-6  rounded-md bg-[#32A8C4] bg-opacity-10 w-full'>
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
              size='md'
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
                    value={question.yourAnswer}
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
      <FormLabel style={{ fontSize: 20 }} id='demo-radio-buttons-group-label'>
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
          <FormControlLabel
            style={
              review
                ? option === question.correctAnswer
                  ? {
                      backgroundColor: '#7ecee1',
                      fillOpacity: 0.6,
                      borderRadius: 5,
                      marginBlock: 2,
                    }
                  : option === question.yourAnswer &&
                    option !== question.correctAnswer
                  ? {
                      backgroundColor: '#e07d7d',
                      fillOpacity: 0.6,
                      borderRadius: 5,
                      marginBlock: 2,
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

const questions = [
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

const markedQuestions = [
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

export default withAuth('Student', AssessmentDetailsPage);

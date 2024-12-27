import React, { useState } from "react";
import { subjectData } from "../lectures";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import Button from "@/components/Atoms/Button";
import { useRouter } from "next/router";
import AssessmentCard from "@/components/Molecules/Card/AssessmentCard";
import { ArrowBackIos, Close } from "@mui/icons-material";
import Input from "@/components/Atoms/Input";
import InputField from "@/components/Atoms/InputField";

const ModifyAssessments = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState(["Question 1"]);
  const [answers, setAnswers] = useState([["Answer 1"]]);

  const addQuestion = () => {
    const newQuestion = `Question ${questions.length + 1}`;
    setQuestions([...questions, newQuestion]);
    setAnswers([...answers, []]);
  };

  const addAnswer = (questionIndex: number) => {
    const newAnswer = `Answer ${answers[questionIndex].length + 1}`;
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = [
      ...updatedAnswers[questionIndex],
      newAnswer,
    ];
    setAnswers(updatedAnswers);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    const updatedAnswers = [...answers];
    updatedQuestions.splice(index, 1);
    updatedAnswers.splice(index, 1);
    setQuestions(updatedQuestions);
    setAnswers(updatedAnswers);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex].splice(answerIndex, 1);
    setAnswers(updatedAnswers);
  };
  return (
    <TeachersWrapper
      title='Assessments'
      metaTitle='Olive Grove ~ Create or Modify Assessments'
    >
      <div className='p-12 space-y-5'>
        {/* Title */}
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-medium text-dark font-roboto'>
              Access Assessments
            </span>
            <span className='text-md text-subtext font-roboto'>
              Manage, create and access assessments.
            </span>
          </div>
          <div className=''>
            <button
              className='flex items-center font-roboto font-medium text-primary text-base cursor-pointer'
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIos className='text-primary !text-base' />
              Back
            </button>
          </div>
        </div>

        <div className=''>
          <form
            className='flex flex-col gap-y-5 w-[560px]'
            // onKeyPress={handleKeyPress}
            // onSubmit={handleSignup}
          >
            <div className='flex flex-col mx-auto gap-y-5 w-full'>
              {/* {formError?.emailError !== "" && formError?.emailError} */}

              <div className='flex flex-col gap-2 h-full'>
                <div className='flex flex-col gap-2 w-full'>
                  <label
                    htmlFor='subject'
                    className='font-medium font-roboto text-sm text-dark/80'
                  >
                    Subject:
                  </label>
                  <select
                    // value={formState.instituteType}
                    name='subject'
                    // onChange={handleChange}
                    required
                    className='flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal h-full outline-none border-[1.5px] border-dark/20 w-full text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext'
                  >
                    <option value='mathematics' className='h-full'>
                      Mathematics
                    </option>
                    <option value='english' className='h-full'>
                      English
                    </option>
                  </select>
                </div>
              </div>
              {/*  */}

              <div className='flex flex-col gap-2 h-full'>
                <div className='flex flex-col gap-2 w-full'>
                  <label
                    htmlFor='assessmentType'
                    className='font-medium font-inter text-sm text-dark/80'
                  >
                    Type of Assessment:
                  </label>
                  <select
                    // value={formState.assessmentType}
                    name='assessmentType'
                    // onChange={handleChange}
                    required
                    className='flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-inter font-normal h-full outline-none border-[1.5px] border-dark/20 w-full text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext'
                  >
                    <option value='classWork' className='h-full'>
                      Class Work
                    </option>
                    <option value='assignment' className='h-full'>
                      Assignment
                    </option>
                    <option value='test' className='h-full'>
                      Test
                    </option>
                  </select>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='duration'
                  className='font-medium font-inter text-sm text-dark/80'
                >
                  Duration:
                </label>
                <Input
                  type='time'
                  name='duration'
                  // value={formState.duration}
                  // onChange={handleChange}
                  placeholder='duration'
                  required={true}
                  className='input'
                />
              </div>

              <div className='space-y-6'>
                <div className='flex space-x-4'>
                  <span className=''>Questions: </span>
                  <div className='flex flex-col space-y-5 w-full'>
                    <div className='flex items-center space-x-2'>
                      <span className='border rounded-sm flex items-center justify-center w-7 h-7 text-subtext text-sm cursor-pointer'>
                        {questions.length}
                      </span>
                      <span
                        className='border rounded-sm flex items-center justify-center w-7 h-7 text-subtext text-sm cursor-pointer'
                        onClick={addQuestion}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col space-y-8 gap-2 h-full'>
                  {questions.map((question, index) => (
                    <div key={index} className='space-y-4'>
                      <div className='flex flex-col gap-2 w-full'>
                        <label
                          htmlFor={`question${index}`}
                          className='font-medium font-inter text-sm text-dark/80'
                        >
                          {question}:
                        </label>
                        <div className='flex items-center w-full space-x-2'>
                          <Input
                            type='text'
                            name='question'
                            placeholder='Enter Question'
                            required={true}
                            className='input'
                          />
                          {questions.length > 1 && (
                            <Close
                              className='text-[#FF3B3B]'
                              onClick={() => removeQuestion(index)}
                            />
                          )}
                        </div>
                      </div>
                      {answers[index].map((answer, answerIndex) => (
                        <div key={answerIndex}>
                          <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center w-full space-x-2'>
                              <Input
                                type='text'
                                name='question'
                                id={`answer${answerIndex}`}
                                value={answer}
                                onChange={(e) => {
                                  const updatedAnswers = [...answers];
                                  updatedAnswers[index][answerIndex] =
                                    e.target.value;
                                  setAnswers(updatedAnswers);
                                }}
                                placeholder={`Enter answer ${answerIndex + 1}`}
                                className='input'
                              />
                              <Close
                                className='text-[#FF3B3B]'
                                onClick={() => removeAnswer(index, answerIndex)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button onClick={() => addAnswer(index)}>
                        Add Answer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", ModifyAssessments);

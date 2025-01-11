import { TAssessmnentQuestion, TFetchState } from "@/components/utils/types";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { v4 as uuidv4 } from "uuid";

type TEachAssessmentQuestionReducerActions =
  | "POPULATE_QUESTION"
  | "EDIT_QUESTION"
  | "ADD_OPTION"
  | "EDIT_OPTION"
  | "EDIT_FILE_CONFIG"
  | "DELETE_OPTION";

type TEachAssessmentQuestionContext = {
  question: TAssessmnentQuestion<"draft">;
  dispatch: Dispatch<{
    type: TEachAssessmentQuestionReducerActions;
    payload?: any;
  }>;
  handle_each_question_config_change: (name: string, value: any) => void;
};

const EachAssessmentQuestionContext =
  createContext<TEachAssessmentQuestionContext>({
    question: {
      _id: "",
      questionText: "",
      options: [],
      correctAnswer: { _id: "", content: "" },
      questionImages: [""],
      questionType: "multiple_choice",
      maxMarks: 0,
    },
    dispatch: () => {},
    handle_each_question_config_change: () => {},
  });

const EachQuestionReducer: Reducer<
  TAssessmnentQuestion<"draft">,
  { type: TEachAssessmentQuestionReducerActions; payload?: any }
> = (question, action) => {
  // * Update the question configuration
  if (action.type === "EDIT_QUESTION") {
    return {
      ...question,
      ...action.payload,
    };
  }

  // * Add a new option to the list of options
  if (action.type === "ADD_OPTION") {
    const old_question = { ...question };

    old_question.options = [...(old_question.options || []), action.payload];

    return {
      ...old_question,
    };
  }

  // * Update the specified option
  if (action.type === "EDIT_OPTION") {
    const old_options = [...(question.options || [])];

    const option_index = old_options.findIndex(
      (p) => p._id === action.payload._id
    );

    if (option_index < 0) return;

    old_options[option_index] = {
      ...old_options[option_index],
      content: action.payload.content,
    };

    return {
      ...question,
      options: [...old_options],
    };
  }

  // * Delete the specified option
  if (action.type === "DELETE_OPTION") {
    const old_options = [...(question.options || [])];

    const filtered_options = old_options?.filter(
      (p) => p._id !== action.payload
    );

    if (!filtered_options) return question;

    return {
      ...question,
      options: filtered_options,
    };
  }

  if (action.type === "EDIT_FILE_CONFIG") {
    const old_question = { ...question };
    question.fileRequirements = {
      ...question.fileRequirements,
      ...action.payload,
    };

    return { ...old_question };
  }

  return question;
};

const EachAssessmentQuestionContextProvider: FC<{
  children: ReactNode;
  question: TAssessmnentQuestion<"preview">;
}> = ({ children, question: initial_question }) => {
  const [question, dispatch] = useReducer(EachQuestionReducer, {
    _id: "",
    questionText: "",
    options: [],
    correctAnswer: { _id: "", content: "" },
    questionImages: [""],
    questionType: "multiple_choice",
    maxMarks: 0,
  });

  const handle_each_question_config_change = (name: string, value: any) => {
    dispatch({
      type: "EDIT_QUESTION",
      payload: { [name]: value },
    });
  };

  useEffect(() => {
    dispatch({
      type: "EDIT_QUESTION",
      payload: {
        ...initial_question,
        options:
          initial_question.options?.map((content) => ({
            _id: uuidv4(),
            content,
          })) || [],
      },
    });
  }, []);

  return (
    <EachAssessmentQuestionContext.Provider
      value={{
        question,
        dispatch,
        handle_each_question_config_change,
      }}
    >
      {children}
    </EachAssessmentQuestionContext.Provider>
  );
};

export const useEachAssessmentQuestionContext = () => {
  const context = useContext(EachAssessmentQuestionContext);

  if (!context) {
    console.log(
      "useEachAssessmentQuestionContext must be used within the EachAssessmentQuestionContextProvider"
    );
    return {} as TEachAssessmentQuestionContext;
  }

  return context;
};

export default EachAssessmentQuestionContextProvider;

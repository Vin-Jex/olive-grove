import { TAssessmnentQuestion, TFetchState } from "@/components/utils/types";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  Reducer,
  useContext,
  useReducer,
  useState,
} from "react";

type TAssessmentQuestionsReducerActions =
  | "ADD_QUESTION"
  | "REMOVE_QUESTION"
  | "EDIT_QUESTION"
  | "EDIT_FILE_CONFIG"
  | "ADD_OPTION"
  | "EDIT_OPTION"
  | "CLEAR_QUESTIONS"
  | "DELETE_OPTION";

const AssessmentQuestionsContext = createContext<{
  assessment_questions: TFetchState<TAssessmnentQuestion<"draft">[]>;
  dispatch: Dispatch<{
    type: TAssessmentQuestionsReducerActions;
    payload?: any;
  }>;
  handle_question_config_change: (
    question_id: string,
    name: string,
    value: any
  ) => void;
}>({
  assessment_questions: { data: [], error: undefined, loading: false },
  dispatch: () => {},
  handle_question_config_change: () => {},
});

const QuestionsReducer: Reducer<
  TFetchState<TAssessmnentQuestion<"draft">[]>,
  { type: TAssessmentQuestionsReducerActions; payload?: any }
> = (state, action) => {
  if (action.type === "ADD_QUESTION") {
    return {
      data: [...state.data, action.payload],
      loading: false,
      error: undefined,
    };
  }

  if (action.type === "REMOVE_QUESTION") {
    const filtered_data = state.data.filter((p) => p._id !== action.payload);

    return {
      data: [...filtered_data],
      loading: false,
      error: undefined,
    };
  }

  // * Update the question configuration
  if (action.type === "EDIT_QUESTION") {
    const old_questions = [...state.data];

    const index = old_questions.findIndex((p) => p._id === action.payload._id);

    if (index < 0) return state;

    old_questions[index] = { ...old_questions[index], ...action.payload };

    return {
      data: [...old_questions],
      loading: false,
      error: undefined,
    };
  }

  // * Add a new option to the list of options
  if (action.type === "ADD_OPTION") {
    const old_questions = [...state.data];

    const index = old_questions.findIndex(
      (p) => p._id === action.payload.question_id
    );

    if (index < 0) return state;

    old_questions[index] = {
      ...old_questions[index],
      options: [...(old_questions[index].options || []), action.payload.option],
    };

    return {
      data: [...old_questions],
      loading: false,
      error: undefined,
    };
  }

  // * Update the specified option
  if (action.type === "EDIT_OPTION") {
    const old_questions = [...state.data];

    const parent_index = old_questions.findIndex(
      (p) => p._id === action.payload.question_id
    );

    if (parent_index < 0) return state;

    const option_index = old_questions[parent_index].options?.findIndex(
      (p) => p._id === action.payload.option._id
    );

    console.log("Parent index", parent_index);
    console.log("Option index", option_index);

    if (
      !old_questions[parent_index].options ||
      option_index === undefined ||
      option_index < 0
    )
      return state;

    // // eslint-disable-next-line
    // old_questions[parent_index]!.options[option_index] = {
    //   // eslint-disable-next-line
    //   ...old_questions[parent_index].options[option_index],
    //   // eslint-disable-next-line
    //   content: action.payload.option.content,
    // };

    (old_questions[parent_index] as any).options[option_index] = {
      ...(old_questions[parent_index] as any).options[option_index],
      content: action.payload.option.content,
    };

    return {
      data: [...old_questions],
      loading: false,
      error: undefined,
    };
  }

  // * Delete the specified option
  if (action.type === "DELETE_OPTION") {
    const old_questions = [...state.data];

    const parent_index = old_questions.findIndex(
      (p) => p._id === action.payload.question_id
    );

    if (parent_index < 0) return state;

    const filtered_options = old_questions[parent_index].options?.filter(
      (p) => p._id !== action.payload.option._id
    );

    if (!filtered_options) return state;

    old_questions[parent_index].options = [...filtered_options];

    return {
      data: [...old_questions],
      loading: false,
      error: undefined,
    };
  }

  if (action.type === "EDIT_FILE_CONFIG") {
    const old_questions = [...state.data];

    const parent_index = old_questions.findIndex(
      (p) => p._id === action.payload.question_id
    );

    if (parent_index < 0) return state;

    old_questions[parent_index].fileRequirements = {
      ...old_questions[parent_index].fileRequirements,
      ...action.payload.fileRequirements,
    };

    return {
      data: [...old_questions],
      loading: false,
      error: undefined,
    };
  }

  if (action.type === "CLEAR_QUESTIONS") {
    return { data: [], loading: false, error: undefined };
  }

  return { data: state.data, loading: false, error: undefined };
};

const AssessmentQuestionsContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [assessment_questions, dispatch] = useReducer(QuestionsReducer, {
    data: [],
    loading: false,
    error: undefined,
  });

  const handle_question_config_change = (
    question_id: string,
    name: string,
    value: any
  ) => {
    dispatch({
      type: "EDIT_QUESTION",
      payload: { _id: question_id, [name]: value },
    });
  };

  return (
    <AssessmentQuestionsContext.Provider
      value={{ assessment_questions, dispatch, handle_question_config_change }}
    >
      {children}
    </AssessmentQuestionsContext.Provider>
  );
};

export const useAssessmentQuestionsContext = () => {
  const context = useContext(AssessmentQuestionsContext);

  if (!context)
    throw new Error(
      "useAssessmentQuestionsContext must be used within the AssessmentQuestionsContextProvider"
    );

  return context;
};

export default AssessmentQuestionsContextProvider;

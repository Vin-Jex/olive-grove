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

type TAssessmentQuestionsReducerActions = "ADD_QUESTION" | "REMOVE_QUESTION";

const AssessmentQuestionsContext = createContext<{
  assessment_questions: TFetchState<TAssessmnentQuestion[]>;
  dispatch: Dispatch<{
    type: TAssessmentQuestionsReducerActions;
    payload?: any;
  }>;
}>({
  assessment_questions: { data: [], error: undefined, loading: false },
  dispatch: () => {},
});

const QuestionsReducer: Reducer<
  TFetchState<TAssessmnentQuestion[]>,
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

  return (
    <AssessmentQuestionsContext.Provider
      value={{ assessment_questions, dispatch }}
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

import { TCourseModalFormData } from "@/components/Molecules/Modal/CourseModal";
import { baseUrl } from "@/components/utils/baseURL";
import { TCourse, TResponse } from "@/components/utils/types";
import { useCourseContext } from "@/contexts/CourseContext";
import { FC } from "react";
import Cookies from "js-cookie";
import Wrapper from "./CourseWrapper";

const Add: FC<{
  type: "chapter" | "lesson" | "topic";
  parentId: string;
}> = ({ type, parentId }) => {
  const { dispatch, openModal, setModalRequestState } = useCourseContext();

  /**
   * * Function responsible for creating a new chapter/lesson/topic - Making the API request to the endpoint required to create any of the items
   * @returns void
   */
  const createNew = async (formState: TCourseModalFormData) => {
    try {
      // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
      setModalRequestState({
        data: undefined,
        loading: true,
        error: undefined,
      });

      // * Get the access token from the cookies
      const jwt = Cookies.get("jwt");

      // * Make an API request to create this item
      const response = await fetch(
        `${baseUrl}/courses/${
          type === "chapter"
            ? "chapters"
            : type === "lesson"
            ? "lessons"
            : type === "topic"
            ? "section"
            : ""
        }/${parentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: jwt || "",
          },
          body: JSON.stringify({
            ...formState,
          }),
        }
      );

      // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
      if (!response.ok) {
        // * If it's a 400 error, display message that the input details are incomplete
        if (response.status == 400) {
          const data = (await response.json()) as TResponse<any>;
          setModalRequestState({
            data: undefined,
            loading: false,
            error: data.message,
          });
          return false;
        }

        // * If it's any other error code, display default error msg
        setModalRequestState({
          data: undefined,
          loading: false,
          error: `An error occurred while creating the ${type}`,
        });

        console.error("Returned false");
        return false;
      }

      // * Update the existing data with that returned by the API request
      const responseData = (await response.json()) as TResponse<TCourse>;
      setModalRequestState({
        data: responseData.data,
        loading: false,
        error: undefined,
      });

      // * Add a new item (chapter/lesson/topic) with the details of the newly created item to the Course reducer
      dispatch({
        type:
          type === "chapter"
            ? "CREATE_CHAPTER"
            : type === "lesson"
            ? "CREATE_LESSON"
            : type === "topic"
            ? "CREATE_TOPIC"
            : "CREATE_CHAPTER",
        payload: {
          parentId: parentId,
          title: responseData.data.title,
          description: responseData.data.description,
          _id: responseData.data._id,
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      setModalRequestState({
        data: undefined,
        loading: false,
        error: "An error occured",
      });
      return false;
    }
  };

  /**
   * * Function responsible for opening the modal
   */
  const onAdd = () => {
    openModal({
      modalMetadata: {
        formData: {
          title: "",
          description: "",
        },
        mode: "create",
        type: type,
        handleAction: createNew,
      },
    });
  };

  return (
    <>
      <Wrapper type="add" onAdd={onAdd}>
        Add new {type}
      </Wrapper>
    </>
  );
};

export default Add;

import { TCourseModalFormData } from "@/components/Molecules/Modal/CourseModal";
import { TCourse, TFetchState, TResponse } from "../types";
import { TCourseDispatch } from "@/contexts/CourseContext";
import Cookies from "js-cookie";
import { baseUrl } from "../baseURL";

/**
 * * Function responsible for editing/delite a new chapter/lesson/topic - Making the API request to the endpoint required to edit/delete any of the items
 * @returns void
 */
export const editItem = async (
  type: "chapter" | "lesson" | "topic",
  setEditItemRes: React.Dispatch<
    React.SetStateAction<TFetchState<TCourseModalFormData | undefined>>
  >,
  reqData: TCourseModalFormData,
  dispatch: TCourseDispatch,
  method: "PUT" | "DELETE"
) => {
  try {
    // * Set the loading state to true, error state to false, and data to an undefined, when the API request is about to be made
    setEditItemRes({
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
      }/${reqData._id}`,
      {
        method: method || "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt || "",
        },
        body: JSON.stringify({
          ...reqData,
        }),
      }
    );

    // * if there was an issue while making the request, or an error response was recieved, display an error message to the user
    if (!response.ok) {
      // * If it's a 400 error, display message that the input details are incomplete
      if (response.status == 400) {
        const data =
          method === "PUT"
            ? ((await response.json()) as TResponse<TCourse>)
            : { message: undefined };
        setEditItemRes({
          data: undefined,
          loading: false,
          error: data.message,
        });
        return false;
      }

      // * If it's any other error code, display default error msg
      setEditItemRes({
        data: undefined,
        loading: false,
        error: `An error occurred while editing the ${type}`,
      });

      console.error("Returned false");
      return false;
    }

    // * Update the existing data with that returned by the API request
    const responseData =
      method === "PUT"
        ? ((await response.json()) as TResponse<TCourseModalFormData>)
        : method === "DELETE"
        ? { data: reqData }
        : { data: undefined };
    setEditItemRes({
      data: responseData.data,
      loading: false,
      error: undefined,
    });

    console.log("Edit data response", responseData, method);

    // * Edit/Delete an existing item (chapter/lesson/topic) with the details of the updated/deleted item to the Course reducer
    dispatch({
      type:
        method === "PUT"
          ? type === "chapter"
            ? "EDIT_CHAPTER"
            : type === "lesson"
            ? "EDIT_LESSON"
            : type === "topic"
            ? "EDIT_TOPIC"
            : "EDIT_CHAPTER"
          : method === "DELETE"
          ? type === "chapter"
            ? "DELETE_CHAPTER"
            : type === "lesson"
            ? "DELETE_LESSON"
            : type === "topic"
            ? "DELETE_TOPIC"
            : "DELETE_CHAPTER"
          : "EDIT_CHAPTER",
      payload: {
        title: responseData.data?.title,
        description: responseData.data?.description,
        _id: responseData.data?._id,
        parentId:
          method === "PUT"
            ? type === "lesson"
              ? responseData.data?.chapterId
              : type === "topic"
              ? responseData.data?.lessonId
              : ""
            : method === "DELETE"
            ? type === "lesson"
              ? reqData?.chapterId
              : type === "topic"
              ? reqData?.lessonId
              : ""
            : "",
      },
    });
    console.log("Adding " + type);

    return true;
  } catch (error) {
    console.error(error);
    setEditItemRes({
      data: undefined,
      loading: false,
      error: "An error occured",
    });

    return false;
  }
};

/**
 * Fetches a list of courses created by a teacher.
 *
 * This function makes an API request to retrieve courses, optionally filtered by title.
 *
 * @param filter - An optional object to filter courses:
 *   - `query`: Field to filter by (e.g., "title").
 *   - `value`: Value to filter against.
 *
 * @returns A promise that resolves to an array of `TCourse` objects or a string error message.
 *          Returns an array if courses are found or an error message if an error occurs.
 *
 * @throws Will throw an error if the response status is not OK.
 *         Displays "No course found" for 404 errors and a generic error message for others.
 *
 * @example
 * const courses = await fetchCourses({ query: "title", value: "Mathematics" });
 * // Check if the result type if an array or a string
 * if (Array.isArray(result)) {
 *   // Handle successful fetch of courses
 * } else {
 *   // Handle error message
 * }
 */
export const fetchCourses = async (filter?: {
  query: "title";
  value: string;
}): Promise<TCourse[] | string> => {
  try {
    // Construct the API URL with optional filter
    const url = `${baseUrl}/courses${
      filter ? `?${filter.query}=${filter.value}` : ""
    }`;

    // Get the access token from the cookies
    const jwt = Cookies.get("jwt");

    // Make an API request to retrieve the list of courses
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwt || "",
      },
    });

    // Check for response errors
    if (!response.ok) {
      if (response.status === 404) {
        // Return error message for 404
        return "No course found";
      } else {
        // Generic error message
        return "An error occurred while retrieving courses";
      }
    }

    const responseData = (await response.json()) as TResponse<TCourse[]>;
    return responseData.data;
  } catch (error) {
    console.error(error);
    // Return error message on exception
    return "An error occurred while retrieving courses";
  }
};

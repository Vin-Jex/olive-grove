import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/Molecules/WithAuth";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import SearchInput from "@/components/Atoms/SearchInput";
import TableReuse from "@/components/Molecules/Table/TableReuse";
import Img from "@/public/image/student3.png";
import { TFetchState, TStudent } from "@/components/utils/types";
import Cookies from "js-cookie";
import { baseUrl } from "@/components/utils/baseURL";

const Students = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fetchStudentsState, setFetchStudentsState] = useState<
    TFetchState<TStudent[]>
  >({
    data: [],
    error: undefined,
    loading: false,
  });

  const columns = [
    { label: "Student Names", key: "student" },
    { label: "Class Work", key: "classWork" },
    { label: "Home Work", key: "homeWork" },
    { label: "Test", key: "test" },
    { label: "Assessment", key: "assessment" },
    { label: "Total", key: "total" },
  ];

  /**
   * Function to retrieve list of assessments
   */
  const fetchStudents = useCallback(async () => {
    try {
      // Display loading state
      setFetchStudentsState((prev) => ({
        ...prev,
        loading: true,
        error: undefined,
      }));

      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");

      const response = await fetch(`${baseUrl}/students`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        // const errorData = await response.json();
        if (
          // response.status === "No lectures found for the provided teacher ID."
          response.status === 404
        ) {
          // Display error state
          setFetchStudentsState((prev) => ({
            data: [],
            loading: false,
            error: {
              message: "No students found",
              status: 404,
              state: true,
            },
          }));
        } else {
          // Display error state
          setFetchStudentsState((prev) => ({
            ...prev,
            loading: false,
            error: {
              message: "Failed to load students.",
              status: 500,
              state: true,
            },
          }));
        }
        return;
      }

      const data = await response.json();
      // Display data
      setFetchStudentsState((prev) => ({
        data: data,
        loading: false,
        error: undefined,
      }));
      setSearchResults(data);
    } catch (err) {
      // Display error state
      setFetchStudentsState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message: "Failed to load students.",
          status: 500,
          state: true,
        },
      }));
    } finally {
      // Remove loading state
      setFetchStudentsState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Filter students by name, or email address
   */
  const filterStudents = useCallback(
    (value: string) => {
      const filtered_students = fetchStudentsState.data?.filter((student) =>
        [
          student.firstName.toLocaleLowerCase(),
          student.lastName.toLocaleLowerCase(),
          student.middleName?.toLocaleLowerCase(),
          student.email.toLocaleLowerCase(),
        ].includes(value.toLocaleLowerCase())
      );

      setSearchResults(filtered_students);
    },
    [fetchStudentsState.data]
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <TeachersWrapper title="Student" metaTitle="Olive Groove ~ Student">
      <div className="space-y-5">
        {/* Title */}
        <div className="flex flex-col">
          <span className="text-lg font-medium text-dark font-roboto">
            Students
          </span>
          <span className="text-md text-subtext font-roboto">
            View student performances
          </span>
        </div>

        <div className="space-y-8 md:!my-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-y-4">
            <select
              // value={formState.instituteType}
              name="subject"
              // onChange={handleChange}
              required
              className="flex items-center px-2 sm:px-2.5 py-3.5 rounded-xl bg-transparent !border-[#D0D5DD] font-roboto font-normal w-full md:w-[200px] h-full outline-none border-[1.5px] border-dark/20 text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder:text-subtext first-letter:!uppercase text-subtext order-2"
            >
              <option value="mathematics" className="h-full">
                Mathematics
              </option>
              <option value="english" className="h-full">
                English
              </option>
            </select>

            <div className="">
              <SearchInput
                shape="rounded-lg"
                placeholder="Search"
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                initialData={[]}
              />
            </div>
          </div>
          <TableReuse
            data={searchResults || []}
            columns={columns}
            action={false}
          />
        </div>
      </div>
    </TeachersWrapper>
  );
};

export default withAuth("Teacher", Students);

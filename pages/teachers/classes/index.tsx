import React, { useState, useEffect, useCallback } from "react";
import withAuth from "@/components/Molecules/WithAuth";
import SwitchContentNav from "@/components/Molecules/Navs/SwitchContentNav";
import TeacherSubjectCard from "@/components/Molecules/Card/TeacherSubjectCard";
import EditClassModal from "@/components/Molecules/Modal/EditClassModal";
import Button from "@/components/Atoms/Button";
import CreateClassModal from "@/components/Molecules/Modal/CreateClassModal";
import TeachersWrapper from "@/components/Molecules/Layouts/Teacher.Layout";
import { baseUrl } from "@/components/utils/baseURL";
import Cookies from "js-cookie";
import ServerError from "@/components/Atoms/ServerError";
import NotFoundError from "@/components/Atoms/NotFoundError";
import Loader from "@/components/Atoms/Loader";

interface ClassData {
  subject: string;
  description: string;
  classTime: string;
  meetingLink: string;
  teacher: string;
  isActive: boolean;
  academicWeekDate: string;
  recordedLecture: string;
  attendance: {
    student: string;
    attended: boolean;
    timestamp: string;
  }[];
}

const Classes = () => {
  const [activeItem, setActiveItem] = useState("all courses");
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [formState, setFormState] = useState({
    class: "",
    description: "",
    duration: "",
    meetingLink: "",
    video: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: 404 | 500; msg: string }>();

  const handleModalEdit = () => {
    setOpenModalEdit(!openModalEdit);
  };

  const handleModalCreate = () => {
    setOpenModalCreate(!openModalCreate);
  };

  const fetchClasses = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const token = Cookies.get("jwt");
      setLoading(true);
      const response = await fetch(`${baseUrl}/teacher/${userId}/lectures`, {
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
          setError({ msg: "No classes found for your profile.", status: 404 });
        } else {
          setError({ msg: "Failed to load classes.", status: 500 });
        }
        return;
      }

      const data = await response.json();
      setClasses(data?.data);
    } catch (err) {
      setError({ msg: "Failed to load classes", status: 500 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <>
      <EditClassModal
        formState={formState}
        setFormState={setFormState}
        type="class"
        handleModalClose={handleModalEdit}
        modalOpen={openModalEdit}
      />
      <CreateClassModal
        formState={formState}
        setFormState={setFormState}
        type="class"
        handleModalClose={handleModalCreate}
        modalOpen={openModalCreate}
      />
      <TeachersWrapper title="Classes" metaTitle="Olive Groove ~ Classes">
        <div className="space-y-5 h-full">
          {loading ? (
            <div className="h-full w-full">
              <Loader />
            </div>
          ) : error ? (
            <>
              {error.status === 404 ? (
                <NotFoundError msg={error.msg} />
              ) : (
                <ServerError msg={error.msg} />
              )}
            </>
          ) : (
            <>
              {/* Title */}
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-dark font-roboto">
                    Explore your classes
                  </span>
                  <span className="text-md text-subtext font-roboto">
                    Manage, edit and create classes.
                  </span>
                </div>
                <Button size="xs" width="fit" onClick={handleModalCreate}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M15.0001 10.8317H10.8334V14.9984C10.8334 15.2194 10.7456 15.4313 10.5893 15.5876C10.4331 15.7439 10.2211 15.8317 10.0001 15.8317C9.77907 15.8317 9.56711 15.7439 9.41083 15.5876C9.25455 15.4313 9.16675 15.2194 9.16675 14.9984V10.8317H5.00008C4.77907 10.8317 4.56711 10.7439 4.41083 10.5876C4.25455 10.4313 4.16675 10.2194 4.16675 9.99837C4.16675 9.77736 4.25455 9.5654 4.41083 9.40912C4.56711 9.25284 4.77907 9.16504 5.00008 9.16504H9.16675V4.99837C9.16675 4.77736 9.25455 4.5654 9.41083 4.40912C9.56711 4.25284 9.77907 4.16504 10.0001 4.16504C10.2211 4.16504 10.4331 4.25284 10.5893 4.40912C10.7456 4.5654 10.8334 4.77736 10.8334 4.99837V9.16504H15.0001C15.2211 9.16504 15.4331 9.25284 15.5893 9.40912C15.7456 9.5654 15.8334 9.77736 15.8334 9.99837C15.8334 10.2194 15.7456 10.4313 15.5893 10.5876C15.4331 10.7439 15.2211 10.8317 15.0001 10.8317Z"
                      fill="#FDFDFD"
                    />
                  </svg>
                  <span>Create Class</span>
                </Button>
              </div>

              {/* Switch filter */}
              <SwitchContentNav
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                navLink={["all courses", "active courses"]}
              />

              {/* Course list */}
              {activeItem === "all courses"
                ? classes.map((classItem, index) => (
                    <div key={index} className="mt-8">
                      <span className="text-dark text-xl font-medium capitalize">
                        {new Date(
                          classItem.academicWeekDate
                        ).toLocaleDateString()}
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-8 mt-4">
                        <TeacherSubjectCard
                          key={index}
                          name={classItem.teacher}
                          role={classItem.isActive ? "Active" : "Inactive"}
                          time={new Date(classItem.classTime).toLocaleString()}
                          topic={classItem.description}
                          subject={classItem.subject}
                          btnLink1={() => {}}
                          btnLink2={handleModalEdit}
                        />
                      </div>
                    </div>
                  ))
                : classes
                    .filter((classItem) => classItem.isActive)
                    .map((classItem, index) => (
                      <div key={index} className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6 2xl:gap-8 mt-4">
                          <TeacherSubjectCard
                            key={index}
                            name={classItem.teacher}
                            role={classItem.isActive ? "Active" : "Inactive"}
                            time={new Date(
                              classItem.classTime
                            ).toLocaleString()}
                            topic={classItem.description}
                            subject={classItem.subject}
                            btnLink1={() => {}}
                            btnLink2={handleModalEdit}
                          />
                        </div>
                      </div>
                    ))}
            </>
          )}
        </div>
      </TeachersWrapper>
    </>
  );
};

export default withAuth("Teacher", Classes);

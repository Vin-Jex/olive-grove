export const demo_assessments = [
  {
    _id: "assessmentId123",
    class: {
      _id: "",
      name: "Class A",
      category: "Primary",
      description: "A primary-level class.",
    },
    subject: {
      _id: "courseId456",
      title: "Mathematics 101",
    },
    type: {
      _id: "",
      name: "Quiz",
    },
    teacher: {
      _id: "",
      name: "John Doe",
      password: "",
      teacherID: "teacher123",
      email: "johndoe@example.com",
      tel: 1234567890,
      address: "123 Main Street, City, Country",
      profileImage:
        "https://images.unsplash.com/photo-1721332155484-5aa73a54c6d2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      role: "Teacher",
    },
    academicWeek: {
      _id: "",
      weekNumber: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().setDate(Date.now() + 7).toString(),
      academicYear: "2024/2025",
      isActive: true,
    },
    timeline: new Date().toISOString(),
    description: "Demo assessment",
    createdAt: "2024-09-01T10:00:00Z",
  },
];

export const subjectData = [
  {
    subject: "Further Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Calculus",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Chemistry",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Organic Chemistry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Physics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Motion",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
  {
    subject: "Mathematics",
    role: "Teacher",
    time: "09:00AM - 10:30AM",
    topic: "Trigonomentry",
    name: "Dr. Ayodeji Emmanuel",
    btnLink1: "#",
  },
];


export const TodayClass = [
  {
    subject: "Physics",
    time: "08:30AM - 9:30AM",
    description: "Introduction to Physics",
    teacher: "Mr. John Doe",
  },
  {
    subject: "English Studies",
    time: "09:40AM - 10:20AM",
    description: "Introduction to English",
    teacher: "Mrs. Jane Doe",
  },
  {
    subject: "Chemistry",
    time: "10:30AM - 11:30AM",
    description: "Introduction to Chemistry",
    teacher: "Mr. John Doe",
  },
  {
    subject: "Agricultural Studies",
    time: "11:40AM - 12:20PM",
    description: "Introduction to Agriculture",
    teacher: "Mrs. Jane Doe",
  },
  {
    subject: "Computer Science",
    time: "12:30PM - 1:30PM",
    description: "Introduction to Computer Science",
    teacher: "Mr. John Doe",
  },
];

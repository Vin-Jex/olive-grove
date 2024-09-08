import React, { useState } from "react";

interface ClassCardType {
  title?: string;
  data?: {
    subject: string;
    time: string;
    description: string;
    teacher: string;
  }[];
  modalOpen?: () => void;
  editable?: boolean;
  handleEdit?: () => void;
}

const data = [
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  {
    subject: "Physics",
    time: "8:30am - 9:30am",
    description:
      "Atomic structure is a fundamental topic in physics that explores the composition of matter at the microscopic level. It involves understanding the arrangement of subatomic particles within an atom. At the center is the nucleus, comprising positively charged protons and neutral neutrons. Electrons, which carry a negative charge, orbit the nucleus in defined energy levels.",
    teacher: "Mr Azure Johnson",
  },
  // Add more data items here...
];

const ClassCard: React.FC<ClassCardType> = ({
  title,
  data: Data,
  modalOpen,
  editable = false,
  handleEdit,
}) => {
  const [showAllData, setShowAllData] = useState(false);
  const limitedData = showAllData ? data : data.slice(0, 6);

  const toggleShowAllData = () => {
    setShowAllData(!showAllData);
  };

  return (
    <div className='flex flex-col flex-wrap gap-5 border !z-20 relative px-7 py-7 w-full h-fit rounded-3xl'>
      <div className='flex items-center justify-between'>
        <span className='text-dark text-xl font-roboto font-medium'>
          {title}
        </span>

        {data && data.length > 6 && (
          <button
            className='text-base text-primary cursor-pointer'
            onClick={toggleShowAllData}
          >
            {showAllData ? "Show Less" : "See All"}
          </button>
        )}
      </div>
      {limitedData.map((item, index) => (
        <div
          key={index}
          onClick={modalOpen}
          className={`flex items-center justify-between border-2 rounded-lg p-3 text-subtext ${modalOpen && "cursor-pointer"}`}
        >
          <div className='flex items-center space-x-2'>
            <h3>{item.subject}</h3>

            {editable && (
              <svg
                onClick={(event) => {
                  event.stopPropagation();
                  handleEdit?.();
                }}
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                className="cursor-pointer"
              >
                <path
                  d='M3.75 14.25H4.81875L12.15 6.91875L11.0812 5.85L3.75 13.1813V14.25ZM2.25 15.75V12.5625L12.15 2.68125C12.3 2.54375 12.4658 2.4375 12.6473 2.3625C12.8288 2.2875 13.0192 2.25 13.2188 2.25C13.4187 2.25 13.6125 2.2875 13.8 2.3625C13.9875 2.4375 14.15 2.55 14.2875 2.7L15.3187 3.75C15.4687 3.8875 15.5783 4.05 15.6473 4.2375C15.7163 4.425 15.7505 4.6125 15.75 4.8C15.75 5 15.7155 5.19075 15.6465 5.37225C15.5775 5.55375 15.4682 5.71925 15.3187 5.86875L5.4375 15.75H2.25ZM11.6063 6.39375L11.0812 5.85L12.15 6.91875L11.6063 6.39375Z'
                  fill='#1E1E1E'
                  fillOpacity='0.6'
                />
              </svg>
            )}
          </div>
          <span className=''>{item.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ClassCard;

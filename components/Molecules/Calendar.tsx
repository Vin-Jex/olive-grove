import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React, { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMontFirstDay, setCurrentMonthFirstDay] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [lastDayOfCurrentMonth, setLastDayOfCurrentMonth] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );

  function handlePreviousMonth() {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(new Date(previousMonth));
    setCurrentMonthFirstDay(new Date(previousMonth));
    setLastDayOfCurrentMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    );
  }
  function handleNextMonth() {
    const firstDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    // const nextMonth =
    //   firstDayOfNextMonth.toLocaleDateString() ===
    //   new Date().toLocaleDateString()
    //     ? firstDayOfNextMonth
    //     : new Date();
    setCurrentDate(new Date(firstDayOfNextMonth));
    setCurrentMonthFirstDay(new Date(firstDayOfNextMonth));
    setLastDayOfCurrentMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)
    );
  }
  return (
    <div className='bg-white border p-6 h-full rounded-lg'>
      <header className='flex justify-between items-center w-full'>
        <button className='' onClick={handlePreviousMonth}>
          <ChevronLeft />
        </button>
        <span className=' text-center'>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          className=''
          disabled={
            currentDate.getTime() ===
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).getTime()
          }
          onClick={handleNextMonth}
        >
          <ChevronRight />
        </button>
      </header>
      <div className='grid grid-cols-7 text-[#B5BEC6] gap-x-8 text-[12px] py-5'>
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>
      <main className='grid gap-y-2 gap-x-5 grid-cols-7 text-[#4A5660]'>
        {Array(currentMontFirstDay.getDay() + lastDayOfCurrentMonth.getDate())
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`${
                markToday(currentDate, i) && "bg-[#3F51B5] text-white "
              }  h-[35px] relative pb-2 pt-2 cursor-pointer  w-[35px] flex items-center justify-center px-2 rounded-full`}
            >
              {i < 7 && i < currentMontFirstDay.getDay() ? (
                <span></span>
              ) : (
                <div
                  className={`font-semibold absolute -translate-y-1/2 top-1/2 text-center align-middle`}
                >
                  {i + 1 - currentMontFirstDay.getDay()}
                </div>
              )}
            </div>
          ))}
      </main>
    </div>
  );
};

function markToday(currentDate: Date, i: number) {
  const currentMonthFirstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const isSameYear = currentDate.getFullYear() === new Date().getFullYear();
  const isSameMonth = currentDate.getMonth() === new Date().getMonth();
  const currentIndexIsToday =
    i + 1 - currentMonthFirstDay.getDay() === new Date().getDate();
  return isSameYear && isSameMonth && currentIndexIsToday;
}

export default Calendar;

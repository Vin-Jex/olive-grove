import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import React, { use, useEffect, useState } from 'react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMontFirstDay, setCurrentMonthFirstDay] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [lastDayOfCurrentMonth, setLastDayOfCurrentMonth] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  );
  useEffect(() => {
    console.log(currentDate.toLocaleString(), 'currentDate');
    // console.log(currentMontFirstDay.toLocaleString(), "currentMontFirstDay");
  }, [currentDate]);

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
    <div className='bg-white border p-6 h-full rounded-md'>
      <header className='flex justify-between items-center'>
        <button onClick={handlePreviousMonth}>
          <ChevronLeft />
        </button>
        <span>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
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
      <div className='grid grid-cols-7 text-sm py-5'>
        <span>SUN</span>
        <span>MON</span>
        <span>TUE</span>
        <span>WED</span>
        <span>THU</span>
        <span>FRI</span>
        <span>SAT</span>
      </div>
      <main className='grid gap-y-4 grid-cols-7'>
        {Array(currentMontFirstDay.getDay() + lastDayOfCurrentMonth.getDate())
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              {i < 7 && i < currentMontFirstDay.getDay() ? (
                <span></span>
              ) : (
                <span
                  className={`font-semibold ${
                    markToday(currentDate, i) &&
                    'bg-blue-600 rounded-full p-[4px] -ml-1 text-white '
                  }`}
                >
                  {i + 1 - currentMontFirstDay.getDay()}
                </span>
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

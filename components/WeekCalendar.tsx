'use client';

import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getWeek, addMonths, subMonths, isSameMonth, isSaturday, isSunday, startOfWeek, endOfWeek, setMonth, setYear } from 'date-fns';
import Lunar from 'lunar-javascript';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const MonthCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasLeapMonth, setHasLeapMonth] = useState(false);
  const [isSelectingMonth, setIsSelectingMonth] = useState(false);
  const [isSelectingYear, setIsSelectingYear] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((day) => {
    if (currentWeek.length === 0 || getWeek(day) !== getWeek(currentWeek[0])) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [day];
    } else {
      currentWeek.push(day);
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getLunarDate = (date: Date) => {
    const solar = Lunar.Solar.fromDate(date);
    const lunar = solar.getLunar();
    return `${lunar.getMonth()}.${lunar.getDay()}`;
  };

  const isHoliday = (date: Date) : string | null => {
    const solarDate = format(date, 'MM-dd');
    const lunarDate = getLunarDate(date);
    
    const holidays : Record<string, string> = {
      '01-01': 'Happy New Year',
      '03-01': '삼일절',
      '05-05': '어린이날',
      '06-06': '현충일',
      '08-15': '광복절',
      '10-03': '개천절',
      '10-09': '한글날',
      '12-25': 'Happy Holiday',
    };

    if (lunarDate === '4.8') {
      return '석가탄신일';
    }

    return holidays[solarDate] || null;
  };

  useEffect(() => {
    const checkLeapMonth = () => {
      for (const week of weeks) {
        for (const day of week) {
          const lunarDate = getLunarDate(day);
          if (lunarDate.startsWith('-')) {
            setHasLeapMonth(true);
            return;
          }
        }
      }
      setHasLeapMonth(false);
    };

    checkLeapMonth();
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleMonthSelect = (month: number) => {
    setCurrentDate(prevDate => setMonth(prevDate, month));
    setIsSelectingMonth(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(prevDate => setYear(prevDate, year));
    setIsSelectingYear(false);
  };

  const renderMonthSelector = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md p-2 z-10">
        {months.map((month, index) => (
          <button
            type="button"
            key={month}
            onClick={() => handleMonthSelect(index)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100"
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const renderYearSelector = () => {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md p-2 z-10">
        {years.map((year) => (
          <button
            type="button"
            key={year}
            onClick={() => handleYearSelect(year)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100"
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          title="Previous Month"
          type="button"
          onClick={goToPreviousMonth}
          className="text-2xl text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <IoChevronBackOutline />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSelectingMonth(!isSelectingMonth)}
            className="text-2xl font-bold text-center text-gray-800 mr-2"
          >
            {format(currentDate, 'MMMM')}
          </button>
          <button
            type="button"
            onClick={() => setIsSelectingYear(!isSelectingYear)}
            className="text-2xl font-bold text-center text-gray-800"
          >
            {format(currentDate, 'yyyy')}
          </button>
          {isSelectingMonth && renderMonthSelector()}
          {isSelectingYear && renderYearSelector()}
        </div>
        <button
          type="button"
          title="Next Month"
          onClick={goToNextMonth}
          className="text-2xl text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <IoChevronForwardOutline />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600">
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
          <div className="col-span-7 text-left text-sm font-semibold text-gray-600 mb-1">
            W{format(week[0], 'ww')}
          </div>
          {week.map((day, dayIndex) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const holidayName = isHoliday(day);
            const dayClass =
              !isCurrentMonth ? 'text-gray-400' :
                holidayName || isSunday(day) ? 'bg-red-100 text-red-800' :
                  isSaturday(day) ? 'bg-blue-100 text-blue-800' :
                    'bg-white text-gray-800';

            return (
              <div
                key={dayIndex}
                className={`p-2 border border-gray-200 rounded-lg text-center ${dayClass} flex flex-col justify-center items-center`}
              >
                <div className="text-lg font-semibold">{format(day, 'd')}</div>
                <div className="text-xs text-gray-500 mt-1">{getLunarDate(day)}</div>
                {holidayName && (
                  <div className="text-xs text-red-600 mt-1">{holidayName}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {hasLeapMonth && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>{`* Dates starting with "-" indicate a leap month in the lunar calendar.`}</p>
        </div>
      )}
    </div>
  );
};

export default MonthCalendar;
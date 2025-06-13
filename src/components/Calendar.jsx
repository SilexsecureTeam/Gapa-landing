import React, { useState } from "react";
import * as Progress from "@radix-ui/react-progress";

// Helper to get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get first day of week for a month (0 = Sunday)
const getFirstDayOfWeek = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const availableTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

// Updated months to start with May 2025 and June 2025
const months = [
  { name: "May 2025", month: 4, year: 2025 },
  { name: "June 2025", month: 5, year: 2025 },
];

const Calendar = () => {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0); // Index of the left month
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Get month objects for left and right calendars
  const leftMonthObj = months[currentMonthIdx];
  const rightMonthObj =
    months[Math.min(currentMonthIdx + 1, months.length - 1)];

  // Calculate days and first day of week for both months
  const leftDaysInMonth = getDaysInMonth(leftMonthObj.year, leftMonthObj.month);
  const rightDaysInMonth = getDaysInMonth(
    rightMonthObj.year,
    rightMonthObj.month
  );
  const leftFirstDayOfWeek = getFirstDayOfWeek(
    leftMonthObj.year,
    leftMonthObj.month
  );
  const rightFirstDayOfWeek = getFirstDayOfWeek(
    rightMonthObj.year,
    rightMonthObj.month
  );

  // Build calendar grids
  const buildCalendarDays = (daysInMonth, firstDayOfWeek) => {
    const calendarDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null); // empty slots before first day
    }
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push(d);
    }
    return calendarDays;
  };

  const leftCalendarDays = buildCalendarDays(
    leftDaysInMonth,
    leftFirstDayOfWeek
  );
  const rightCalendarDays = buildCalendarDays(
    rightDaysInMonth,
    rightFirstDayOfWeek
  );

  const handlePrevMonth = () => {
    if (currentMonthIdx > 0) {
      setCurrentMonthIdx(currentMonthIdx - 1);
      if (
        !months.some(
          (m) =>
            m.month === leftMonthObj.month - 1 && m.year === leftMonthObj.year
        )
      ) {
        months.unshift({
          name: new Date(
            leftMonthObj.year,
            leftMonthObj.month - 1
          ).toLocaleString("default", { month: "long", year: "numeric" }),
          month: leftMonthObj.month - 1,
          year: leftMonthObj.year,
        });
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIdx < months.length - 2) {
      setCurrentMonthIdx(currentMonthIdx + 1);
      if (
        !months.some(
          (m) =>
            m.month === rightMonthObj.month + 1 && m.year === rightMonthObj.year
        )
      ) {
        months.push({
          name: new Date(
            rightMonthObj.year,
            rightMonthObj.month + 1
          ).toLocaleString("default", { month: "long", year: "numeric" }),
          month: rightMonthObj.month + 1,
          year: rightMonthObj.year,
        });
      }
    }
  };

  const handleDateSelect = (day, month, year) => {
    setSelectedDate({ day, month, year });
    setSelectedTime(""); // reset time if date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected:", selectedDate, selectedTime);
  };

  return (
    <div className="py-4 lg:py-6 px-2 sm:px-4 md:px-8 lg:px-24 w-full mx-auto ">
      {/* Progress Bar */}
      <div className="mb-6 py-5 px-10 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-1 text-xs sm:text-sm">
          <span className="font-medium text-[#141414]">Progress</span>
          <span className="font-medium text-[#492F92]">80% completed</span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-[#e8e6f0] rounded-full w-full h-4"
          value={80}
          max={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={80}
        >
          <Progress.Indicator
            className="bg-[#492F92] h-full transition-transform duration-500 ease-out"
            style={{ width: "80%" }}
          />
        </Progress.Root>
      </div>

      {/* Main Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg p-2 sm:p-4 md:p-6 flex flex-col items-center shadow"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#141414] text-center mb-4 sm:mb-6">
          When would you like your service?
        </h2>
        {/* Calendar with Top Arrows */}
        <div className="w-full flex flex-col mx-auto md:w-[70%] items-center">
          <div className="w-full flex justify-between mb-2 sm:mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={currentMonthIdx === 0}
              className={`text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 rounded ${
                currentMonthIdx === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "text-[#492F92] hover:bg-gray-100"
              }`}
              aria-label="Previous month"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={currentMonthIdx >= months.length - 2}
              className={`text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 rounded ${
                currentMonthIdx >= months.length - 2
                  ? "opacity-30 cursor-not-allowed"
                  : "text-[#492F92] hover:bg-gray-100"
              }`}
              aria-label="Next month"
            >
              {">"}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between space-x-0 sm:space-x-4 gap-4">
            {/* Left Calendar (May 2025) */}
            <div className="w-full sm:w-1/2">
              <div className="text-xs sm:text-sm md:text-base font-semibold text-center mb-1 sm:mb-2">
                {leftMonthObj.name}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full mb-1 sm:mb-2 text-center text-[#757575] text-xs sm:text-sm font-medium">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full">
                {leftCalendarDays.map((day, idx) =>
                  day ? (
                    <button
                      key={idx}
                      type="button"
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm
                        ${
                          selectedDate &&
                          selectedDate.day === day &&
                          selectedDate.month === leftMonthObj.month &&
                          selectedDate.year === leftMonthObj.year
                            ? "bg-[#FFD600] text-[#141414] font-bold"
                            : "bg-transparent text-[#141414] hover:bg-[#f3f1f7]"
                        }
                      `}
                      onClick={() =>
                        handleDateSelect(
                          day,
                          leftMonthObj.month,
                          leftMonthObj.year
                        )
                      }
                      aria-label={`Select ${leftMonthObj.name} ${day}`}
                    >
                      {day}
                    </button>
                  ) : (
                    <span
                      key={idx}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    ></span>
                  )
                )}
              </div>
            </div>
            {/* Right Calendar (June 2025) */}
            <div className="w-full sm:w-1/2">
              <div className="text-xs sm:text-sm md:text-base font-semibold text-center mb-1 sm:mb-2">
                {rightMonthObj.name}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full mb-1 sm:mb-2 text-center text-[#757575] text-xs sm:text-sm font-medium">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full">
                {rightCalendarDays.map((day, idx) =>
                  day ? (
                    <button
                      key={idx}
                      type="button"
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm
                        ${
                          selectedDate &&
                          selectedDate.day === day &&
                          selectedDate.month === rightMonthObj.month &&
                          selectedDate.year === rightMonthObj.year
                            ? "bg-[#FFD600] text-[#141414] font-bold"
                            : "bg-transparent text-[#141414] hover:bg-[#f3f1f7]"
                        }
                      `}
                      onClick={() =>
                        handleDateSelect(
                          day,
                          rightMonthObj.month,
                          rightMonthObj.year
                        )
                      }
                      aria-label={`Select ${rightMonthObj.name} ${day}`}
                    >
                      {day}
                    </button>
                  ) : (
                    <span
                      key={idx}
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                    ></span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Available Times */}
        <div className="w-full flex flex-col items-start my-4 sm:my-6">
          <div className="text-xs sm:text-sm md:text-base font-semibold text-[#141414] mb-2 sm:mb-3">
            Available times
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {availableTimes.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded border text-xs sm:text-sm
                  ${
                    selectedTime === time
                      ? "bg-[#492F92] text-white border-[#492F92]"
                      : "bg-white border-gray-300 text-[#141414] hover:border-[#492F92]"
                  } font-medium transition-colors`}
                disabled={!selectedDate}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-24 sm:w-32 px-3 sm:px-4 py-1 sm:py-2 bg-[#492F92] text-white rounded shadow hover:bg-[#3a236d] transition-colors font-semibold text-xs sm:text-sm"
          disabled={!selectedDate || !selectedTime}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Calendar;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isPast, isSameMonth, startOfMonth } from "date-fns";
import { toast } from "react-toastify";

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

const Calendar = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const [months, setMonths] = useState([
    {
      name: new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      month: currentMonth,
      year: currentYear,
    },
    {
      name: new Date(currentYear, currentMonth + 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      month: (currentMonth + 1) % 12,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
    },
  ]);

  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.trustData?.bookingId;

  const leftMonthObj = months[currentMonthIdx];
  const rightMonthObj = months[currentMonthIdx + 1];

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

  const buildCalendarDays = (daysInMonth, firstDayOfWeek, month, year) => {
    const calendarDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      calendarDays.push({
        day: d,
        isPast: isPast(date) && !isSameMonth(date, today),
      });
    }
    return calendarDays;
  };

  const leftCalendarDays = buildCalendarDays(
    leftDaysInMonth,
    leftFirstDayOfWeek,
    leftMonthObj.month,
    leftMonthObj.year
  );
  const rightCalendarDays = buildCalendarDays(
    rightDaysInMonth,
    rightFirstDayOfWeek,
    rightMonthObj.month,
    rightMonthObj.year
  );

  const handlePrevMonth = () => {
    // Prevent navigation to months before the current month
    if (
      isSameMonth(
        new Date(leftMonthObj.year, leftMonthObj.month),
        startOfMonth(today)
      )
    ) {
      return;
    }
    const newMonth = new Date(leftMonthObj.year, leftMonthObj.month - 1);
    const newMonths = [...months];
    newMonths.unshift({
      name: newMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      month: newMonth.getMonth(),
      year: newMonth.getFullYear(),
    });
    setMonths(newMonths);
    setCurrentMonthIdx(currentMonthIdx + 1 - 1);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(rightMonthObj.year, rightMonthObj.month + 1);
    const newMonths = [...months];
    newMonths.push({
      name: nextMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      month: nextMonth.getMonth(),
      year: nextMonth.getFullYear(),
    });
    setMonths(newMonths);
    setCurrentMonthIdx(currentMonthIdx + 1);
  };

  const handleDateSelect = (day, month, year) => {
    const selected = new Date(year, month, day);
    if (isPast(selected) && !isSameMonth(selected, today)) {
      return; // Prevent selecting past dates
    }
    setSelectedDate({ day, month, year });
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time.");
      return;
    }

    // Navigate to success page without API call
    const appointment = {
      ...location.state,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      bookingId,
    };

    navigate("/success", { state: appointment });
  };

  return (
    <div className="py-4 lg:py-6 px-2 sm:px-4 md:px-8 lg:px-24 w-full mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg p-2 sm:p-4 md:p-6 flex flex-col items-center shadow"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#141414] text-center mb-4 sm:mb-6">
          When would you like your service?
        </h2>
        <div className="w-full flex flex-col mx-auto md:w-[70%] items-center">
          <div className="w-full flex justify-between mb-2 sm:mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 rounded text-[#492F92] hover:bg-gray-100"
              aria-label="Previous month"
              disabled={isSameMonth(
                new Date(leftMonthObj.year, leftMonthObj.month),
                startOfMonth(today)
              )}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="text-lg sm:text-xl font-bold px-1 sm:px-2 py-1 rounded text-[#492F92] hover:bg-gray-100"
              aria-label="Next month"
            >
              {">"}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between space-x-0 sm:space-x-4 gap-4">
            {[leftMonthObj, rightMonthObj].map((monthObj, idx) => {
              const calendarDays =
                idx === 0 ? leftCalendarDays : rightCalendarDays;
              return (
                <div key={monthObj.name} className="w-full sm:w-1/2">
                  <div className="text-xs sm:text-sm md:text-base font-semibold text-center mb-1 sm:mb-2">
                    {monthObj.name}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full mb-1 sm:mb-2 text-center text-[#757575] text-xs sm:text-sm font-medium">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 w-full">
                    {calendarDays.map((entry, i) =>
                      entry ? (
                        <button
                          key={i}
                          type="button"
                          className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm
                            ${
                              selectedDate &&
                              selectedDate.day === entry.day &&
                              selectedDate.month === monthObj.month &&
                              selectedDate.year === monthObj.year
                                ? "bg-[#FFD600] text-[#141414] font-bold"
                                : entry.isPast
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-transparent text-[#141414] hover:bg-[#f3f1f7]"
                            }
                          `}
                          onClick={() =>
                            !entry.isPast &&
                            handleDateSelect(
                              entry.day,
                              monthObj.month,
                              monthObj.year
                            )
                          }
                          aria-label={`Select ${monthObj.name} ${entry.day}`}
                          disabled={entry.isPast}
                        >
                          {entry.day}
                        </button>
                      ) : (
                        <span
                          key={i}
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                        ></span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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

        <button
          type="submit"
          className="w-24 sm:w-32 px-3 sm:px-4 py-1 sm:py-2 bg-[#492F92] text-white rounded shadow hover:bg-[#3a236d] transition-colors font-semibold text-xs sm:text-sm"
          disabled={!selectedDate || !selectedTime}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Calendar;

import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(6); // Let's assume 6 is the selected date for now

  const renderDaysOfWeek = () => {
    const days = ['Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha', 'Yak'];
    return days.map((day, index) => (
      <div key={index} className="calendar-day-header">
        {day}
      </div>
    ));
  };

  const renderDates = () => {
    const daysInMonth = new Array(30).fill(null).map((_, index) => index + 1);
    return daysInMonth.map((day) => (
      <div
        key={day}
        className={`calendar-date ${day === selectedDate ? 'selected' : ''}`}
        onClick={() => setSelectedDate(day)}
      >
        {day}
      </div>
    ));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-button">❮</button>
        <span>September 2024</span>
        <button className="calendar-nav-button">❯</button>
      </div>
      <div className="calendar-grid">
        {renderDaysOfWeek()}
        {renderDates()}
      </div>
    </div>
  );
};

export default Calendar;

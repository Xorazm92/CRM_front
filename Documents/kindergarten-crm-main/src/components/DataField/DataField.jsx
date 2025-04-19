import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import "./DateField.css";
import images from "../../images";

const DateField = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const datepickerRef = useRef();

  const handleIconClick = () => {
    if (datepickerRef.current) {
      datepickerRef.current.setFocus(); 
    }
  };

  return (
    <div className="date-input-container">
      <label className="date-input-label">Boshlangan sana</label>
      <div className="date-input-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd.MM.yyyy"
          placeholderText="15.05.2000"
          className="date-input-field"
          ref={datepickerRef}
        />
        <img
          src={images.calendar}
          alt="calendar icon"
          className="calendar-icon"
          onClick={handleIconClick}
        />
      </div>
    </div>
  );
};

export default DateField;

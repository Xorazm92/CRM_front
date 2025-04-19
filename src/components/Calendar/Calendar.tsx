import React from "react";

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
  // Tailwind styles and implementation here
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <input
        type="date"
        value={value.toISOString().split('T')[0]}
        onChange={e => onChange(new Date(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </div>
  );
};

export default Calendar;

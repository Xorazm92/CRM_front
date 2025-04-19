import React, { useState } from "react";
import "./Filter.css";
import InputSelect from "../InputSelect/InputSelect";
import Checkbox from "../Checkbox/Checkbox";
import images from "../../images";

const Filter = ({ closeFilter }) => {
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [attendanceYes, setAttendanceYes] = useState(false);
  const [attendanceNo, setAttendanceNo] = useState(false);

  const handleSave = () => {
    console.log({
      birthDate,
      gender,
      groupNumber,
      attendance: {
        yes: attendanceYes,
        no: attendanceNo,
      },
    });
    closeFilter(); // Close the filter modal after saving
  };

  return (
    <div className="filter-modal">
      <div className="filter-header">
        <h3>Filtr</h3>
        <button className="close-btn" onClick={closeFilter}>
          <img width={24} src={images.x_icon} alt="close" />
        </button>
      </div>
      <div className="filter-body">
        <InputSelect
          label="Tug'ilgan sana"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          options={["2020", "2021", "2022"]}
        />
        <InputSelect
          label="Jinsi"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          options={["Erkak", "Ayol"]}
        />
        <InputSelect
          label="Guruh raqami"
          value={groupNumber}
          onChange={(e) => setGroupNumber(e.target.value)}
          options={["1", "2", "3"]}
        />
        <div>
          <Checkbox
            label="Ha"
            checked={attendanceYes}
            onChange={(e) => setAttendanceYes(e.target.checked)}
          />
          <Checkbox
            label="Yo'q"
            checked={attendanceNo}
            onChange={(e) => setAttendanceNo(e.target.checked)}
          />
        </div>
      </div>
      <div className="filter-footer">
        <button className="save-button" onClick={handleSave}>
          <img width={24} src={images.success} alt="save" />
          <span>Saqlash</span>
        </button>
      </div>
    </div>
  );
};

export default Filter;

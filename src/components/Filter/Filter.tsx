import React, { useState } from "react";
import InputSelect from "../InputSelect/InputSelect";
import Checkbox from "../Checkbox/Checkbox";
import images from "../../images";

interface FilterProps {
  closeFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({ closeFilter }) => {
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
    closeFilter();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filtr</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100" onClick={closeFilter}>
            <img width={24} src={images.x_icon} alt="close" />
          </button>
        </div>
        <div className="space-y-4">
          <InputSelect
            label="Tug'ilgan sana"
            value={birthDate}
            onChange={(e: any) => setBirthDate(e.target.value)}
            options={["2020", "2021", "2022"]}
          />
          <InputSelect
            label="Jinsi"
            value={gender}
            onChange={(e: any) => setGender(e.target.value)}
            options={["Erkak", "Ayol"]}
          />
          <InputSelect
            label="Guruh raqami"
            value={groupNumber}
            onChange={(e: any) => setGroupNumber(e.target.value)}
            options={["1", "2", "3"]}
          />
          <div className="flex gap-4">
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
        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow" onClick={handleSave}>
            <img width={24} src={images.success} alt="save" />
            <span>Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;

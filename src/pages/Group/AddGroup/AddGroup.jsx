import React, { useState } from "react";
import "./AddGroup.css";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";
import Input from "../../../components/Inputs/Input/Input";
import SelectField from "../../../components/SelectField/SelectField";
import DateField from "../../../components/DataField/DataField";

function AddGroup() {
  const [formData, setFormData] = useState({
    level: "",
    birthDate: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="add-group-wrapper">
      <div className="header-student-page">
        <h1>Guruhlarni qo’shish</h1>
        <SaveCancelBtn />
      </div>
      <div className="add-group-inputs">
        <SelectField
          label="Jinsi"
          name="gender"
          options={[
            { label: "O'g'il bola", value: "male" },
            { label: "Qiz bola", value: "female" },
          ]}
          value={formData.gender}
          onChange={handleInputChange}
        />
        <DateField
          label="Tug'ilgan sana"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
        />
        <Input
          label="Daraja"
          value={formData.level}
          onChange={handleInputChange}
          name="level"
          placeholder="Daraja kiriting"
        />
      </div>
    </div>
  );
}

export default AddGroup;

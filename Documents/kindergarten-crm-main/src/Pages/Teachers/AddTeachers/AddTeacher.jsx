import React, { useState } from "react";
import "./AddTeacher.css";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import Input from "../../../components/Inputs/Input/Input";
import DateField from "../../../components/DataField/DataField";
import SelectField from "../../../components/SelectField/SelectField";

function AddTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    middlename: "",
    birthdate: "",
    address: "",
    salary: "",
    phone_number: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="at_wrapper">
      <div className="header-student-page">
        <h1>O’quvchilarni qo’shish</h1>
        <SaveCancelBtn />
      </div>

      <div className="form_wrapper">
        <div className="form_wrapper_info">
          <div className="add-teacher-top">
            <div className="add-teacher-image">
              <ImageUpload />
            </div>

            <div className="add-teacher-info">
              <Input
                label="Ism"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                placeholder="Shokirjon"
              />
              <Input
                label="Familiya"
                value={formData.lastname}
                onChange={handleInputChange}
                name="lastname"
                placeholder="Sultonov"
              />
              <Input
                label="Sharifi"
                value={formData.middlename}
                onChange={handleInputChange}
                name="middlename"
                placeholder="Tursinjon o’gli"
              />
              <DateField
                label="Tug'ilgan sana"
                value={formData.birthdate}
                onChange={handleInputChange}
                name="birthdate"
              />
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
              <Input
                label="Yashash manzili"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                placeholder="Toshkent, Guliston"
              />
            </div>
          </div>

          <div className="add-teacher-bottom">
            <Input
              label="Tel raqami"
              value={formData.phone_number}
              onChange={handleInputChange}
              name="phone_number"
              placeholder="+998 (93) 123-45-67"
            />
            <SelectField
              label="Mutahassisligi"
              name="fan"
              options={[
                { label: "O'g'il bola", value: "male" },
                { label: "Qiz bola", value: "female" },
              ]}
              value={formData.specialist}
              onChange={handleInputChange}
            />
            <SelectField
              label="Mutahassisligi"
              name="fan"
              options={[
                { label: "O'g'il bola", value: "male" },
                { label: "Qiz bola", value: "female" },
              ]}
              value={formData.specialist}
              onChange={handleInputChange}
            />
            <SelectField
              label="Mutahassisligi"
              name="fan"
              options={[
                { label: "O'g'il bola", value: "male" },
                { label: "Qiz bola", value: "female" },
              ]}
              value={formData.specialist}
              onChange={handleInputChange}
            />
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
            <DateField />
            <Input
              label="Maoshi"
              value={formData.salary}
              onChange={handleInputChange}
              name="salary"
              placeholder="3 000 000 so'm"
            />
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default AddTeacher;

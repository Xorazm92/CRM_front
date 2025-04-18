import React, { useState } from "react";
import "./AddStudent.css";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import DateField from "../../../components/DataField/DataField";
import Input from "../../../components/Inputs/Input/Input";
import SelectField from "../../../components/SelectField/SelectField";
import Calendar from "react-calendar";

function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    middlename: "",
    birthdate: "",
    address: "",
    payment: "",
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
    <div className="as_wrapper">
      <div className="header-student-page">
        <h1>O’quvchilarni qo’shish</h1>
        <SaveCancelBtn />
      </div>

      <div className="form_wrapper">
        <div className="form_wrapper_info">
          <div className="add-student-top">
            <div className="add-student-image">
              <ImageUpload />
            </div>

            <div className="add-student-info">
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

          <div className="add-student-bottom">
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
              label="To’lov summa"
              value={formData.payment}
              onChange={handleInputChange}
              name="payment"
              placeholder="500 000 so’m"
            />
            <Input
              label="Ota-Onasini tel raqami"
              value={formData.phone_number}
              onChange={handleInputChange}
              name="phone_number"
              placeholder="+998 (93) 123-45-67"
            />
          </div>
        </div>

        <div>
          
        </div>
      </div>
    </div>
  );
}

export default AddStudent;

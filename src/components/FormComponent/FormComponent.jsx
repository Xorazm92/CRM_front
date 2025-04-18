// FormComponent.js
import React, { useState } from "react";
import Input from "../Inputs/Input/Input";
import Select from "../Select/Select";
import InputSelect from "../InputSelect/InputSelect";
import Dropdown from "../Dropdown/Dropdown";
import SelectField from "../SelectField/SelectField";

const FormComponent = () => {
  const [paymentStatus, setPaymentStatus] = useState("tolangan");
  const [profession, setProfession] = useState("oqituvchi");
  const [formData, setFormData] = useState({
    ism: "",
    familiya: "",
    sharfi: "",
    telRaqami: "",
    farzandlarSoni: "",
    maktabDavomiyligi: "",
  });
  const paymentOptions = [
    { label: "To'langan", value: "tolangan" },
    { label: "To'lanmagan", value: "tolanmagan" },
  ];

  const professionOptions = [
    { label: "O'qituvchi", value: "oqituvchi" },
    { label: "Dasturchi", value: "dasturchi" },
    { label: "Muallif", value: "muallif" },
    // Add more professions here
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form>
      <div className="form-row">
        <Input
          label="Ism"
          value={formData.ism}
          onChange={handleInputChange}
          name="ism"
          placeholder="Shokirjon"
        />
        <Input
          label="Familiya"
          value={formData.familiya}
          onChange={handleInputChange}
          name="familiya"
          placeholder="Sultonov"
        />
        <Input
          label="Sharfi"
          value={formData.sharfi}
          onChange={handleInputChange}
          name="sharfi"
          placeholder="Tursinjon o'g'li"
        />
        <Input
          label="Tel raqami"
          value={formData.telRaqami}
          onChange={handleInputChange}
          name="telRaqami"
          placeholder="+998 (93) 123-45-67"
        />
        <Input
          label="Farzandlar soni"
          value={formData.farzandlarSoni}
          onChange={handleInputChange}
          name="farzandlarSoni"
          placeholder="2 ta"
        />
        <Input
          label="Maktabda davomiyligi"
          value={formData.maktabDavomiyligi}
          onChange={handleInputChange}
          name="maktabDavomiyligi"
          placeholder="300 kun"
        />
        <SelectField
          label="To'lov holati"
          options={paymentOptions}
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        />
        <SelectField
          label="Kasbi"
          options={professionOptions}
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
      </div>
    </form>
  );
};

export default FormComponent;

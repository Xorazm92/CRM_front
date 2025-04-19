import React, { useState } from "react";
import Input from "../Inputs/Input/Input";
import SelectField from "../SelectField/SelectField";

interface FormData {
  ism: string;
  familiya: string;
  sharfi: string;
  telRaqami: string;
  farzandlarSoni: string;
  maktabDavomiyligi: string;
}

const paymentOptions = [
  { label: "To'langan", value: "tolangan" },
  { label: "To'lanmagan", value: "tolanmagan" },
];

const professionOptions = [
  { label: "O'qituvchi", value: "oqituvchi" },
  { label: "Dasturchi", value: "dasturchi" },
  { label: "Muallif", value: "muallif" },
];

const FormComponent: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState("tolangan");
  const [profession, setProfession] = useState("oqituvchi");
  const [formData, setFormData] = useState<FormData>({
    ism: "",
    familiya: "",
    sharfi: "",
    telRaqami: "",
    farzandlarSoni: "",
    maktabDavomiyligi: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded shadow">
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
        onChange={(e: any) => setPaymentStatus(e.target.value)}
      />
      <SelectField
        label="Kasbi"
        options={professionOptions}
        value={profession}
        onChange={(e: any) => setProfession(e.target.value)}
      />
    </form>
  );
};

export default FormComponent;

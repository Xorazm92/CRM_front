
import React, { useState } from "react";
import InputField from "../../../components/InputField/InputField";
import SelectField from "../../../components/SelectField/SelectField";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";

const AddTeacher: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    phone: "",
    group: "",
    image: null as File | null,
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file: File) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">O'qituvchi qo'shish</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Ism"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <InputField
            label="Familiya"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <SelectField
            label="Fan"
            name="subject"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            options={["Matematika", "Fizika", "Kimyo"]}
          />
          <InputField
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
          <SelectField
            label="Guruh"
            name="group"
            value={formData.group}
            onChange={(e) => handleInputChange("group", e.target.value)}
            options={["15-gurux", "16-gurux"]}
          />
        </div>
        
        <div className="mt-6">
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>
      </div>
      
      <SaveCancelBtn />
    </div>
  );
};

export default AddTeacher;

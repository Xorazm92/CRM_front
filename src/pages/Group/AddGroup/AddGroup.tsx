
import React, { useState } from "react";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";
import SelectField from "../../../components/SelectField/SelectField";

interface FormData {
  level: string;
  birthDate: string;
  gender: string;
}

const AddGroup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    level: "",
    birthDate: "",
    gender: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlarni qo'shish</h1>
        <SaveCancelBtn />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Jinsi"
          name="gender"
          options={[
            { label: "O'g'il bola", value: "male" },
            { label: "Qiz bola", value: "female" },
          ]}
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tug'ilgan sana</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Daraja</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            placeholder="Daraja kiriting"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AddGroup;

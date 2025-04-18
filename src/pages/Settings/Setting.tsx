import React from "react";
import Select from "../../components/Select/Select";
import SettingsForm from "../../components/SettingForm/SettingForm";

const Setting: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sozlamalar</h1>
        <Select />
      </div>
      <SettingsForm />
    </div>
  );
};

export default Setting;
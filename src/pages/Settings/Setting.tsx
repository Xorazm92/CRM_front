
import React from "react";
import Select from "../../components/Select/Select";
import SettingsForm from "../../components/SettingForm/SettingForm";

const Setting: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sozlamalar</h1>
        <Select />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <SettingsForm />
      </div>
    </div>
  );
};

export default Setting;

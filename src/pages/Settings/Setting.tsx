
import React from "react";
import { useQuery } from '@tanstack/react-query';
import Select from "../../components/Select/Select";
import SettingsForm from "../../components/SettingForm/SettingForm";
import { settingsService } from "../../services/settings";

const Settings: React.FC = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sozlamalar</h1>
        <Select />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <SettingsForm initialData={settings} />
        </div>
      )}
    </div>
  );
};

export default Settings;

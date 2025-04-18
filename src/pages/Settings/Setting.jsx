import React from "react";
import "./Setting.css";
import Select from "../../components/Select/Select";
import SettingsForm from "../../components/SettingForm/SettingForm";

function Setting() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Sozlamalar</h1>
        <Select />
      </div>
      <SettingsForm />
    </div>
  );
}

export default Setting;

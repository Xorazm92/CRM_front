import React, { useState } from "react";
import "./SettingForm.css";

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    faceID: "1234567",
    apiID: "55555555",
    apiHash: "b996cb497dfas365dd56",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="settings-form">
      <div className="form-group">
        <label>Face ID</label>
        <input
          type="text"
          name="faceID"
          value={formData.faceID}
          onChange={handleChange}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Api ID</label>
        <input
          type="text"
          name="apiID"
          value={formData.apiID}
          onChange={handleChange}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Api HASH</label>
        <input
          type="text"
          name="apiHash"
          value={formData.apiHash}
          onChange={handleChange}
          disabled
        />
      </div>
    </div>
  );
};

export default SettingsForm;

import React, { useState, useEffect } from "react";
import "./SettingForm.css";
import instance from "../../api/axios";
import Toast from "../Toast";
import ClipLoader from "react-spinners/ClipLoader";

const SettingsForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await instance.get("/settings");
        // settings should be array of {key, value}
        const obj = {};
        (res.data || []).forEach(s => { obj[s.key] = s.value; });
        setFormData(obj);
      } catch (err) {
        setToast({ message: err.message || "Sozlamalarni yuklashda xatolik", type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save all settings (PUT each key)
      await Promise.all(Object.entries(formData).map(([key, value]) => instance.put(`/settings/${key}`, { value })));
      setToast({ message: "Sozlamalar muvaffaqiyatli saqlandi!", type: 'success' });
    } catch (err) {
      setToast({ message: err.message || "Saqlashda xatolik", type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}><ClipLoader color="#009688" size={40} /></div>;

  return (
    <form className="settings-form" onSubmit={handleSave}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {Object.keys(formData).length === 0 && <div>Sozlamalar topilmadi</div>}
      {Object.entries(formData).map(([key, value]) => (
        <div className="form-group" key={key}>
          <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
      ))}
      <button type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
    </form>
  );
};

export default SettingsForm;

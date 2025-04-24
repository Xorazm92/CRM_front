import React, { useState } from "react";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import instance from "../../api/axios";
import "./Settings.css";

const Settings = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setToast({ message: "Barcha maydonlar to‘ldirilishi shart", type: 'error' });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setToast({ message: "Yangi parollar mos emas", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/auth/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });
      setToast({ message: "Parol muvaffaqiyatli o‘zgartirildi!", type: 'success' });
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Xatolik yuz berdi", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h2>Sozlamalar</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <input
          type="password"
          name="oldPassword"
          placeholder="Joriy parol"
          value={form.oldPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Yangi parol"
          value={form.newPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Yangi parolni tasdiqlang"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? <ClipLoader size={18} color="#fff" /> : "Parolni o‘zgartirish"}
        </button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import instance from "../../../api/axios";
import Toast from "../../../components/Toast";

const AddTeacherModal = ({ isOpen, onClose, onTeacherAdded }) => {
  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const validate = () => {
    if (!form.full_name.trim()) return "Ism familiya majburiy";
    if (!/^\+?\d{9,15}$/.test(form.contact)) return "Telefon raqam noto‘g‘ri";
    if (!form.birthdate.trim()) return "Tug‘ilgan sana majburiy";
    if (!form.gender.trim()) return "Jinsi majburiy";
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setToast({ message: validationError, type: 'error' });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
      return;
    }
    setLoading(true);
    try {
      await instance.post("/teacher", form);
      setForm({ full_name: "", birthdate: "", gender: "", contact: "" });
      onTeacherAdded();
      setToast({ message: "O‘qituvchi muvaffaqiyatli qo‘shildi!", type: "success" });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Qo‘shishda xatolik");
      setToast({ message: err.response?.data?.message || "Qo‘shishda xatolik", type: 'error' });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="modal-content" style={{background:'#fff',padding:24,borderRadius:8,minWidth:320}}>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <h3>Yangi o‘qituvchi qo‘shish</h3>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="F.I.O" required />
          <input name="birthdate" value={form.birthdate} onChange={handleChange} placeholder="Tug‘ilgan sana" required />
          <input name="gender" value={form.gender} onChange={handleChange} placeholder="Jinsi" required />
          <input name="contact" value={form.contact} onChange={handleChange} placeholder="Kontakt" required />
          {error && <div className="error" style={{color:'red'}}>{error}</div>}
          <div style={{display:'flex',gap:8}}>
            <button type="submit" disabled={loading}>{loading ? "Yuklanmoqda..." : "Qo‘shish"}</button>
            <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherModal;

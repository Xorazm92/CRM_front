import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./Teachers.css";

const AddTeacherModal = ({ isOpen, onClose, onTeacherAdded }) => {
  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    contact: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.birthdate || !form.gender || !form.contact) {
      setToast({ message: "Barcha maydonlarni to‘ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/teacher", form);
      setToast({ message: "O'qituvchi qo'shildi!", type: 'success' });
      setForm({ full_name: "", birthdate: "", gender: "", contact: "" });
      onTeacherAdded && onTeacherAdded();
      onClose();
    } catch (err) {
      setToast({ message: err.message || "Qo'shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal teacher-modal">
        <h3>O'qituvchi qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <input name="full_name" placeholder="F.I.Sh." value={form.full_name} onChange={handleChange} />
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Jinsi</option>
            <option value="Erkak">Erkak</option>
            <option value="Ayol">Ayol</option>
          </select>
          <input name="contact" placeholder="Kontakt" value={form.contact} onChange={handleChange} />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Bekor qilish</button>
            <button type="submit" disabled={loading}>{loading ? <ClipLoader size={16} color="#fff" /> : "Qo'shish"}</button>
          </div>
        </form>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </div>
  );
};

export default AddTeacherModal;

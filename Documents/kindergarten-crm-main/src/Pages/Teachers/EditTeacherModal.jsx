import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./Teachers.css";

const EditTeacherModal = ({ isOpen, onClose, teacher, onTeacherEdited }) => {
  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    contact: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (teacher) {
      setForm({
        full_name: teacher.full_name || teacher.name || "",
        birthdate: teacher.birthdate || teacher.birthDate || "",
        gender: teacher.gender || "",
        contact: teacher.contact || ""
      });
    }
  }, [teacher]);

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
      await instance.put(`/teacher/${teacher.id}`, form);
      setToast({ message: "O'qituvchi yangilandi!", type: 'success' });
      onTeacherEdited && onTeacherEdited();
      onClose();
    } catch (err) {
      setToast({ message: err.message || "Tahrirlashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal teacher-modal">
        <h3>O'qituvchini tahrirlash</h3>
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
            <button type="submit" disabled={loading}>{loading ? <ClipLoader size={16} color="#fff" /> : "Saqlash"}</button>
          </div>
        </form>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </div>
  );
};

export default EditTeacherModal;

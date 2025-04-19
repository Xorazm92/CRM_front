import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./Groups.css";

const AddGroupModal = ({ isOpen, onClose, onGroupAdded }) => {
  const [form, setForm] = useState({
    name: "",
    start_date: "",
    teacher_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      instance.get("/teacher").then(res => setTeachers(res.data || []));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.start_date || !form.teacher_id) {
      setToast({ message: "Barcha maydonlarni to‘ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/group", form);
      setToast({ message: "Guruh qo'shildi!", type: 'success' });
      setForm({ name: "", start_date: "", teacher_id: "" });
      onGroupAdded && onGroupAdded();
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
      <div className="modal group-modal">
        <h3>Guruh qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Guruh nomi" value={form.name} onChange={handleChange} />
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
          <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
            <option value="">O'qituvchi tanlang</option>
            {teachers.map(t => (
              <option value={t.id} key={t.id}>{t.full_name || t.name}</option>
            ))}
          </select>
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

export default AddGroupModal;

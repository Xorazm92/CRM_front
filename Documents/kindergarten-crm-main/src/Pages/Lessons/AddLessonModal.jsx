import React, { useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Lesson.css";

const AddLessonModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', courseId: '', teacherId: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.courseId || !form.teacherId || !form.description) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/lesson", form);
      setToast({ message: "Dars qo'shildi!", type: 'success' });
      setForm({ name: '', courseId: '', teacherId: '', description: '' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.message || "Qo'shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal lesson-modal">
        <h3>Dars qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Nomi</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Kurs ID</label>
            <input name="courseId" value={form.courseId} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>O'qituvchi ID</label>
            <input name="teacherId" value={form.teacherId} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Izoh</label>
            <input name="description" value={form.description} onChange={handleChange} disabled={loading} />
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;

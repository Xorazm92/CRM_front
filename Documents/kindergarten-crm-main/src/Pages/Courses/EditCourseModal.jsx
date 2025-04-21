import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Course.css";

const EditCourseModal = ({ open, onClose, onSuccess, course }) => {
  const [form, setForm] = useState({ name: '', description: '', duration: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || '',
        description: course.description || '',
        duration: course.duration || '',
        status: course.status || 'ACTIVE'
      });
    }
  }, [course]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.duration || !form.status) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.put(`/course/${course.id || course.course_id}`, { ...form, duration: Number(form.duration) });
      setToast({ message: "Kurs tahrirlandi!", type: 'success' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.message || "Tahrirlashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal course-modal">
        <h3>Kursni tahrirlash</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Nomi</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Izoh</label>
            <input name="description" value={form.description} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Davomiyligi (oy)</label>
            <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} disabled={loading} placeholder="Masalan: 6" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} disabled={loading}>
              <option value="ACTIVE">Faol</option>
              <option value="INACTIVE">Nofaol</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Saqlash"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;

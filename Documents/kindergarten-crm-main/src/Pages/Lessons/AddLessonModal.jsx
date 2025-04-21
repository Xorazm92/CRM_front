import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Lesson.css";

const AddLessonModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ group_id: '', topic: '', lesson_date: '', recording_path: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Guruhlarni olish
    instance.get('/groups').then(res => {
      let data = res.data.data || [];
      setGroups(data);
      console.log('Guruhlar:', data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Debug: Ko'rib chiqish uchun formani konsolga chiqaramiz
    console.log('Yuborilayotgan forma:', form);
    if (!form.group_id || !form.topic || !form.lesson_date || !form.recording_path) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        lesson_date: new Date(form.lesson_date).toISOString()
      };
      await instance.post("/lesson", payload);
      setToast({ message: "Dars qo'shildi!", type: 'success' });
      setForm({ group_id: '', topic: '', lesson_date: '', recording_path: '' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Qo'shishda xatolik", type: 'error' });
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
            <label>Guruh</label>
            <select
              name="group_id"
              value={form.group_id}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Guruhni tanlang</option>
              {groups.map((g, idx) => (
                <option key={g.group_id || g._id || idx} value={g.group_id || g._id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Mavzu</label>
            <input name="topic" value={form.topic} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Dars sanasi</label>
            <input name="lesson_date" type="datetime-local" value={form.lesson_date} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Yozuv yo‘li</label>
            <input name="recording_path" value={form.recording_path} onChange={handleChange} disabled={loading} />
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;

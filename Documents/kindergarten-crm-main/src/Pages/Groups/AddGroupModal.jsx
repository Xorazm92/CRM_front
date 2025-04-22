import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./Groups.css";

const AddGroupModal = ({ isOpen, onClose, onGroupAdded }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    course_id: "",
    status: "ACTIVE",
    start_date: "",
    teacher_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      instance.get("/teacher").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setTeachers(data);
      });
      instance.get("/course").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setCourses(data);
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- VALIDATION ---
    if (!form.name || !form.course_id || !form.teacher_id || !form.start_date) {
      setToast({ message: "Barcha majburiy maydonlarni to‘ldiring", type: "error" });
      return;
    }
    if (!form.description || form.description.length < 10) {
      setToast({ message: "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak", type: "error" });
      return;
    }
    setLoading(true);
    try {
      // --- ID mapping o'chirildi, value endi doim _id bo'ladi ---
      const payload = {
        ...form,
        course_id: form.course_id,
        teacher_id: form.teacher_id
      };
      // Konsolga yuborilayotgan payloadni chiqaramiz
      console.log("Yuborilayotgan payload:", payload);
      await instance.post("/groups", payload);
      setToast({ message: "Guruh muvaffaqiyatli qo'shildi!", type: "success" });
      setForm({
        name: "",
        description: "",
        course_id: "",
        status: "ACTIVE",
        start_date: "",
        teacher_id: ""
      });
      if (onGroupAdded) onGroupAdded();
      if (onClose) onClose();
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Xatolik yuz berdi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(33, 33, 33, 0.38)', zIndex: 1000 }}>
      <div className="modal add-group-modal" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 6px 32px rgba(25, 118, 210, 0.12)', padding: 32, maxWidth: 420, width: '100%' }}>
        <h2 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 700, fontSize: 24 }}>Yangi guruh qo'shish</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input name="name" placeholder="Guruh nomi" value={form.name} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <input name="description" placeholder="Tavsif (kamida 10 ta belgi)" value={form.description} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <select name="course_id" value={form.course_id} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }}>
            <option value="">Kurs tanlang</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select name="teacher_id" value={form.teacher_id} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }}>
            <option value="">O‘qituvchi tanlang</option>
            {teachers.map(t => (
              <option key={t._id} value={t._id}>{t.full_name || t.name}</option>
            ))}
          </select>
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <select name="status" value={form.status} onChange={handleChange} style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }}>
            <option value="ACTIVE">Aktiv</option>
            <option value="INACTIVE">Passiv</option>
          </select>
          <div className="modal-actions" style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="button" onClick={onClose} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
            <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', minWidth: 100 }}>
              {loading ? <ClipLoader size={16} color="#fff" /> : "Qo'shish"}
            </button>
          </div>
        </form>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </div>
  );
};

export default AddGroupModal;

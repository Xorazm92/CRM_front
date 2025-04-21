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
    if (!form.name || !form.description || !form.course_id || !form.status || !form.start_date || !form.teacher_id) {
      setToast({ message: "Barcha maydonlarni to‘ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        course_id: form.course_id,
        status: form.status,
        start_date: form.start_date,
        teacher_id: form.teacher_id
      };
      await instance.post("/groups", payload);
      setToast({ message: "Guruh qo'shildi!", type: 'success' });
      setForm({ name: "", description: "", course_id: "", status: "ACTIVE", start_date: "", teacher_id: "" });
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
          <input name="description" placeholder="Guruh tavsifi" value={form.description} onChange={handleChange} />
          <select name="course_id" value={form.course_id} onChange={handleChange}>
            <option value="">Kursni tanlang</option>
            {Array.isArray(courses) && courses.map((c, idx) => (
              <option value={c.id || c.course_id || idx} key={c.id || c.course_id || idx}>
                {c.name || c.course_name || 'No name'}
              </option>
            ))}
          </select>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Aktiv</option>
            <option value="INACTIVE">Noaktiv</option>
            <option value="COMPLETED">Yakunlangan</option>
          </select>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
          <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
            <option value="">O'qituvchi tanlang</option>
            {Array.isArray(teachers) && teachers.map((t, idx) => (
              <option value={t.id || t.user_id || t.teacher_id || idx} key={t.id || t.user_id || t.teacher_id || idx}>
                {t.full_name || t.name || t.username || t.lastname || 'No name'}
              </option>
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

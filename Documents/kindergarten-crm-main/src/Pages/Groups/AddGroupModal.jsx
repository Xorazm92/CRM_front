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
      // --- ID mapping ---
      const selectedCourse = courses.find(c => (c.id || c._id) === form.course_id);
      const selectedTeacher = teachers.find(t => (t.id || t._id) === form.teacher_id);
      const payload = {
        ...form,
        course_id: selectedCourse ? (selectedCourse.id || selectedCourse._id) : '',
        teacher_id: selectedTeacher ? (selectedTeacher.id || selectedTeacher._id) : ''
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
    <div className="modal-overlay">
      <div className="modal add-group-modal">
        <h2>Yangi guruh qo'shish</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Guruh nomi" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Tavsif (kamida 10 ta belgi)" value={form.description} onChange={handleChange} required />
          <select name="course_id" value={form.course_id} onChange={handleChange} required>
            <option value="">Kurs tanlang</option>
            {courses.map(c => (
              <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
            ))}
          </select>
          <select name="teacher_id" value={form.teacher_id} onChange={handleChange} required>
            <option value="">O‘qituvchi tanlang</option>
            {teachers.map(t => (
              <option key={t.id || t._id} value={t.id || t._id}>{t.full_name || t.name}</option>
            ))}
          </select>
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Aktiv</option>
            <option value="INACTIVE">Passiv</option>
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

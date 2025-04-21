import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Lesson.css";

const AddLessonModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', courseId: '', teacherId: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courseMap, setCourseMap] = useState({});
  const [teacherMap, setTeacherMap] = useState({});

  useEffect(() => {
    // Fetch courses
    instance.get('/course').then(res => {
      let data = res.data.data || [];
      // Map: name -> id
      const map = {};
      data.forEach(c => {
        map[c.name] = c._id || c.id || c.name;
      });
      setCourses(data);
      setCourseMap(map);
      console.log('Kurslar:', data);
    });
    // Fetch teachers
    instance.get('/teacher').then(res => {
      let data = res.data.data || [];
      const map = {};
      data.forEach(t => {
        map[t.full_name || t.name] = t._id || t.id || t.full_name || t.name;
      });
      setTeachers(data);
      setTeacherMap(map);
      console.log('Oqituvchilar:', data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Debug: Ko'rib chiqish uchun formani konsolga chiqaramiz
    console.log('Yuborilayotgan forma:', form);
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
            <label>Nomi</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Kurs</label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={e => {
                const name = e.target.selectedOptions[0].textContent;
                setForm({ ...form, courseId: courseMap[name] });
              }}
              disabled={loading}
            >
              <option value="">Kursni tanlang</option>
              {courses.map((c, idx) => (
                <option key={c._id || c.id || idx} value={c._id || c.id || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>O'qituvchi</label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={e => {
                const name = e.target.selectedOptions[0].textContent;
                setForm({ ...form, teacherId: teacherMap[name] });
              }}
              disabled={loading}
            >
              <option value="">O'qituvchini tanlang</option>
              {teachers.map((t, idx) => (
                <option key={t._id || t.id || idx} value={t._id || t.id || t.full_name || t.name}>
                  {t.full_name || t.name}
                </option>
              ))}
            </select>
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

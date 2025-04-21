import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Lesson.css";

const EditLessonModal = ({ open, onClose, onSuccess, lesson }) => {
  const [form, setForm] = useState({
    group_id: '',
    topic: '',
    lesson_date: '',
    recording_path: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (open) {
      // Guruhlarni olish
      instance.get('/groups').then(res => {
        let data = res.data.data || [];
        setGroups(data);
      });
      // Kurslarni olish
      instance.get('/course').then(res => {
        let data = res.data.data || [];
        setCourses(data);
      });
      // O'qituvchilarni olish
      instance.get('/teacher').then(res => {
        let data = res.data.data || [];
        setTeachers(data);
      });
    }
  }, [open]);

  useEffect(() => {
    if (lesson) {
      setForm({
        group_id: lesson.group_id || '',
        topic: lesson.topic || '',
        lesson_date: lesson.lesson_date ? lesson.lesson_date.slice(0,16) : '', // for datetime-local
        recording_path: lesson.recording_path || ''
      });
    }
  }, [lesson]);

  // Guruh tanlanganda kurs va o'qituvchi nomini topamiz
  const selectedGroup = groups.find(g => g.group_id === form.group_id || g._id === form.group_id);
  const courseName = selectedGroup && courses.length ? (courses.find(c => c._id === selectedGroup.course_id || c.id === selectedGroup.course_id)?.name || selectedGroup.course_id) : '';
  const teacherName = selectedGroup && teachers.length ? (teachers.find(t => t._id === selectedGroup.teacher_id || t.id === selectedGroup.teacher_id)?.full_name || selectedGroup.teacher_id) : '';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.group_id || !form.topic || !form.lesson_date) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Sana ISO formatga o'tkaziladi
      const payload = {
        ...form,
        lesson_date: new Date(form.lesson_date).toISOString()
      };
      await instance.patch(`/lesson/${lesson.lesson_id || lesson.id}`, payload);
      setToast({ message: "Dars tahrirlandi!", type: 'success' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Tahrirlashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal lesson-modal">
        <h3>Darsni tahrirlash</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Guruh</label>
            <select name="group_id" value={form.group_id} onChange={handleChange} disabled={loading} required>
              <option value="">Guruh tanlang</option>
              {groups.map(g => (
                <option key={g.group_id || g._id} value={g.group_id || g._id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Mavzu</label>
            <input name="topic" value={form.topic} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label>Sana</label>
            <input name="lesson_date" type="datetime-local" value={form.lesson_date} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label>Yozuv yo'li</label>
            <input name="recording_path" value={form.recording_path} onChange={handleChange} disabled={loading} />
          </div>
          {/* Kurs va o'qituvchi readonly ko'rsatish */}
          <div className="form-group">
            <label>Kurs</label>
            <input value={courseName} disabled readOnly />
          </div>
          <div className="form-group">
            <label>O'qituvchi</label>
            <input value={teacherName} disabled readOnly />
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Saqlash"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default EditLessonModal;

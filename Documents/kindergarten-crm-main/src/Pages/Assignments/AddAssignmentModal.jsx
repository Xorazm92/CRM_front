import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import DatePicker from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import "./Assignments.css";
import "react-datepicker/dist/react-datepicker.css";

const AddAssignmentModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', group_id: '', lesson_id: '', due_date: null });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [groups, setGroups] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!open) return;
    instance.get('/groups').then(res => {
      let data = res.data;
      if (Array.isArray(data)) {
        setGroups(data);
      } else if (Array.isArray(data.data)) {
        setGroups(data.data);
      } else if (Array.isArray(data.results)) {
        setGroups(data.results);
      } else {
        setGroups([]);
      }
    }).catch(() => setGroups([]));
  }, [open]);

  useEffect(() => {
    if (!form.group_id) {
      setLessons([]);
      setForm(f => ({ ...f, lesson_id: '' }));
      return;
    }
    instance.get(`/lesson?group_id=${form.group_id}`).then(res => {
      let data = res.data;
      if (Array.isArray(data.data)) {
        setLessons(data.data);
      } else if (Array.isArray(data)) {
        setLessons(data);
      } else if (Array.isArray(data.results)) {
        setLessons(data.results);
      } else {
        setLessons([]);
      }
    });
  }, [form.group_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // DD.MM.YYYY format uchun yordamchi funksiya
  function formatDateDMY(date) {
    if (!date) return '';
    let d = (date instanceof Date) ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.due_date) {
      setToast({ message: "Nom va tugash sanasi majburiy!", type: 'error' });
      alert("Nom va tugash sanasi majburiy!");
      return;
    }
    setLoading(true);
    let deadlineISO = '';
    if (form.due_date instanceof Date) {
      deadlineISO = form.due_date.toISOString();
    } else if (typeof form.due_date === 'string' && form.due_date.length > 0) {
      const d = new Date(form.due_date);
      deadlineISO = d.toISOString();
    } else {
      deadlineISO = '';
    }
    let groupId = undefined;
    let lessonId = undefined;
    if (form.group_id) {
      const g = groups.find(g => g.group_id === form.group_id || g._id === form.group_id || g.id === form.group_id);
      if (g) groupId = g.group_id || g._id || g.id;
    }
    if (form.lesson_id) {
      const l = lessons.find(l => l.lesson_id === form.lesson_id || l._id === form.lesson_id || l.id === form.lesson_id);
      if (l) lessonId = l.lesson_id || l._id || l.id;
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('deadline', deadlineISO);
    if (form.description) formData.append('description', form.description);
    if (groupId) formData.append('group_id', groupId);
    if (lessonId) formData.append('lesson_id', lessonId);
    if (file) formData.append('file', file);
    try {
      await instance.post("/assignments", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToast({ message: "Vazifa muvaffaqiyatli qo'shildi!", type: 'success' });
      alert("Vazifa muvaffaqiyatli qo'shildi!");
      setForm({ title: '', description: '', group_id: '', lesson_id: '', due_date: null });
      setFile(null);
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      let uzMessage = "Qo'shishda xatolik";
      if (err.response && err.response.data && err.response.data.message) {
        let msg = err.response.data.message;
        if (msg && typeof msg === 'string' && msg.includes('ISO 8601')) {
          uzMessage = "Deadline (tugash sanasi) noto'g'ri formatda. Iltimos, sanani to'g'ri tanlang.";
        } else if (msg && typeof msg === 'string' && msg.includes('must be a UUID')) {
          uzMessage = "Dars yoki guruh ID'si noto'g'ri. Iltimos, tanlovlarni qayta tekshiring.";
        } else if (Array.isArray(msg)) {
          uzMessage = msg.map(m =>
            m.includes('ISO 8601') ? "Deadline (tugash sanasi) noto'g'ri formatda. Iltimos, sanani to'g'ri tanlang."
            : m.includes('must be a UUID') ? "Dars yoki guruh ID'si noto'g'ri. Iltimos, tanlovlarni qayta tekshiring."
            : m
          ).join(', ');
        } else {
          uzMessage = msg;
        }
        alert(uzMessage);
        setToast({ message: uzMessage, type: 'error' });
      } else {
        setToast({ message: uzMessage, type: 'error' });
        alert(uzMessage);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal assignments-modal">
        <h3>Vazifa qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Nomi</label>
            <input name="title" value={form.title} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Guruh</label>
            <select name="group_id" value={form.group_id} onChange={handleChange} disabled={loading}>
              <option value="">Tanlang</option>
              {groups.map((g) => (
                <option key={g.group_id || g._id || g.id} value={g.group_id || g._id || g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Dars</label>
            <select name="lesson_id" value={form.lesson_id} onChange={handleChange} disabled={loading || !form.group_id}>
              <option value="">Tanlang</option>
              {lessons.map((l) => (
                <option key={l.lesson_id || l._id || l.id} value={l.lesson_id || l._id || l.id}>
                  {l.topic} ({l.lesson_date ? formatDateDMY(l.lesson_date) : ''})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tavsif</label>
            <textarea name="description" value={form.description} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Tugash sanasi</label>
            <DatePicker
              selected={form.due_date}
              onChange={date => {
                setForm({ ...form, due_date: date });
              }}
              dateFormat="dd.MM.yyyy"
              placeholderText="DD.MM.YYYY"
              className="datepicker-input"
              disabled={loading}
              locale={enGB}
              autoComplete="off"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              calendarStartDay={1}
            />
          </div>
          <div className="form-group">
            <label>Fayl biriktirish</label>
            <input type="file" onChange={handleFileChange} disabled={loading} />
            {file && <span style={{fontSize:'12px', color:'#555'}}>Tanlangan fayl: {file.name}</span>}
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;

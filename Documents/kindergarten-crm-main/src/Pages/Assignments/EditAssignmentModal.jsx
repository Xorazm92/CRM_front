import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Assignments.css";

const EditAssignmentModal = ({ open, onClose, onSuccess, assignment }) => {
  const [form, setForm] = useState({ title: '', description: '', group_id: '', due_date: '' });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (assignment) {
      setForm({
        title: assignment.title || '',
        description: assignment.description || '',
        group_id: assignment.group_id || '',
        due_date: assignment.due_date ? assignment.due_date.slice(0, 10) : ''
      });
    }
    if (open) {
      instance.get('/groups').then(res => {
        setGroups(res.data || []);
      });
    }
  }, [assignment, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.due_date || !form.group_id) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.put(`/assignments/${assignment.assignment_id || assignment.id}`, form);
      setToast({ message: "Vazifa tahrirlandi!", type: 'success' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.message || "Tahrirlashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  // Guruhlar select uchun fallback: agar groups massiv emas yoki undefined bo'lsa, [] qilib yuboriladi
  const safeGroups = Array.isArray(groups) ? groups : [];

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal assignments-modal">
        <h3>Vazifani tahrirlash</h3>
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
              {safeGroups.map(g => (
                <option key={g.group_id || g._id || g.id} value={g.group_id || g._id || g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tavsif</label>
            <textarea name="description" value={form.description} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Tugash sanasi</label>
            <input type="date" name="due_date" value={form.due_date} onChange={handleChange} disabled={loading} />
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Saqlash"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentModal;

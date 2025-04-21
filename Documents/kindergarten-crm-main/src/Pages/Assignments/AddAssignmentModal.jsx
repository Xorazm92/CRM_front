import React, { useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Assignments.css";

const AddAssignmentModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/assignments", form);
      setToast({ message: "Vazifa qo'shildi!", type: 'success' });
      setForm({ title: '', startDate: '', endDate: '' });
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
      <div className="modal assignments-modal">
        <h3>Vazifa qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Nomi</label>
            <input name="title" value={form.title} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Boshlanish sanasi</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Tugash sanasi</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} disabled={loading} />
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;

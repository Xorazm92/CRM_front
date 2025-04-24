import React, { useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import images from "../../images";
import "./Course.css";

const AddCourseModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', description: '', duration: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

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
      await instance.post("/course", { ...form, duration: Number(form.duration) });
      setToast({ message: "Kurs qo'shildi!", type: 'success' });
      setForm({ name: '', description: '', duration: '', status: 'ACTIVE' });
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
    <div className="modal-overlay" style={{ background: 'rgba(33, 33, 33, 0.38)', zIndex: 1000 }}>
      <div className="modal course-modal" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 6px 32px rgba(25, 118, 210, 0.12)', padding: 32, maxWidth: 420, width: '100%' }}>
        <h3 style={{ marginBottom: 24, color: '#1976d2', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>Kurs qo'shish</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <input name="name" placeholder="Kurs nomi" value={form.name} onChange={handleChange} disabled={loading} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <input name="description" placeholder="Izoh" value={form.description} onChange={handleChange} disabled={loading} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <input name="duration" type="number" min="1" placeholder="Davomiyligi (oy)" value={form.duration} onChange={handleChange} disabled={loading} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }} />
          <select name="status" value={form.status} onChange={handleChange} disabled={loading} style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16 }}>
            <option value="ACTIVE">Faol</option>
            <option value="INACTIVE">Nofaol</option>
          </select>
          <div className="modal-actions" style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', minWidth: 100 }}>
              {loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;

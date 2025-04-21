import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Attendance.css";

const AddAttendanceModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ studentId: '', date: '', status: 'present' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStudentsLoading(true);
    instance.get("/student")
      .then(res => {
        setStudents(res.data.data || []);
      })
      .catch(() => {
        setStudents([]);
      })
      .finally(() => setStudentsLoading(false));
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.date || !form.status) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/attendance", form);
      setToast({ message: "Davomat qo'shildi!", type: 'success' });
      setForm({ studentId: '', date: '', status: 'present' });
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
      <div className="modal attendance-modal">
        <h3>Davomat qo'shish</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Talaba</label>
            {studentsLoading ? (
              <div style={{padding:'8px 0'}}><ClipLoader size={18} color="#009688" /></div>
            ) : (
              <select name="studentId" value={form.studentId} onChange={handleChange} disabled={loading || studentsLoading} required>
                <option value="">Talabani tanlang</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>{student.fullName || student.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label>Sana</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} disabled={loading}>
              <option value="present">Kelgan</option>
              <option value="absent">Kelmagan</option>
            </select>
          </div>
          <button type="submit" disabled={loading || studentsLoading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Qo'shish"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default AddAttendanceModal;

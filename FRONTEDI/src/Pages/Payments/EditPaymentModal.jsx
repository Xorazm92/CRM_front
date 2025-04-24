import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Payments.css";

const EditPaymentModal = ({ open, onClose, onSuccess, payment }) => {
  const [form, setForm] = useState({ student_id: '', date: '', amount: '', status: 'pending' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (payment) {
      setForm({
        student_id: payment.student_id || payment.studentId || '',
        date: payment.date?.slice(0, 10),
        amount: payment.amount,
        status: payment.status
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_id || !form.date || !form.amount || !form.status) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.put(`/payments/student/${payment.id}`, form);
      setToast({ message: "To‘lov tahrirlandi!", type: 'success' });
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.message || "Tahrirlashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal payments-modal">
        <h3>To‘lovni tahrirlash</h3>
        <form onSubmit={handleSubmit}>
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
          <div className="form-group">
            <label>Talaba ID</label>
            <select name="student_id" value={form.student_id} onChange={handleChange} disabled={loading}>
              {/* Talabalar ro'yxati bu yerda chiqishi kerak, agar kerak bo'lsa */}
            </select>
          </div>
          <div className="form-group">
            <label>Sana</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Summasi</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} disabled={loading}>
              <option value="pending">Kutilmoqda</option>
              <option value="paid">To‘langan</option>
              <option value="canceled">Bekor qilingan</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Saqlash"}</button>
          <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Bekor qilish</button>
        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;

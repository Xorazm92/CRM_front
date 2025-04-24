import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddPaymentModal from "./AddPaymentModal";
import EditPaymentModal from "./EditPaymentModal";
import "./Payments.css";

interface Payment {
  id: number;
  student: {
    name: string;
    full_name: string;
    fullName: string;
    studentId: number;
  };
  createdAt: string;
  date: string;
  amount: number;
  status: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/payments/student-payments");
      let data = res.data;
      if (!Array.isArray(data)) {
        data = Array.isArray(data.results) ? data.results : [];
      }
      setPayments(data);
    } catch (err) {
      setError("To‘lovlarni olishda xatolik");
      setToast({ message: err.message || "To‘lovlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/payments/student/${id}`);
      setToast({ message: "To‘lov o‘chirildi!", type: 'success' });
      fetchPayments();
    } catch (err) {
      setToast({ message: err.message || "O‘chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payments-page">
      <h2>To‘lovlar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ To‘lov qo‘shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Talaba</th>
              <th>Sana</th>
              <th>Summasi</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(payments) || payments.length === 0) ? (
              <tr><td colSpan="6">To‘lovlar topilmadi</td></tr>
            ) : payments.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.student?.name || p.student?.full_name || p.student?.fullName || p.studentId}</td>
                <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : (p.date ? p.date.slice(0,10) : '')}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => { setEditItem(p); setShowEdit(true); }} title="Tahrirlash" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <img src={require('../../images/pen_icon.png')} alt="edit" width={22} height={22} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} title="O‘chirish" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <img src={require('../../images/deleteIcon.png')} alt="delete" width={22} height={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddPaymentModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchPayments}
      />
      <EditPaymentModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchPayments}
        payment={editItem && {
          ...editItem,
          student_id: editItem.student_id || editItem.studentId
        }}
      />
    </div>
  );
};

export default Payments;

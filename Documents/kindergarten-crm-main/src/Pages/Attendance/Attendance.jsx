import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddAttendanceModal from "./AddAttendanceModal";
import EditAttendanceModal from "./EditAttendanceModal";
import "./Attendance.css";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch attendance list
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/attendance");
      setAttendance(res.data || []);
    } catch (err) {
      setError("Davomatlarni olishda xatolik");
      setToast({ message: err.message || "Davomatlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Delete attendance
  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/attendance/${id}`);
      setToast({ message: "Davomat o'chirildi!", type: 'success' });
      fetchAttendance();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-page">
      <h2>Davomatlar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ Davomat qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Talaba</th>
              <th>Sana</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan="5">Davomatlar topilmadi</td></tr>
            ) : attendance.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.student?.fullName || a.studentId}</td>
                <td>{a.date?.slice(0, 10)}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => { setEditItem(a); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(a.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddAttendanceModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchAttendance}
      />
      <EditAttendanceModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchAttendance}
        attendance={editItem}
      />
    </div>
  );
};

export default Attendance;

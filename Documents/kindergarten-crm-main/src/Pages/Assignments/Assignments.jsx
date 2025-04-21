import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddAssignmentModal from "./AddAssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";
import "./Assignments.css";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/assignments");
      let data = res.data;
      if (!Array.isArray(data)) {
        data = Array.isArray(data.results) ? data.results : [];
      }
      setAssignments(data);
    } catch (err) {
      setError("Vazifalarni olishda xatolik");
      setToast({ message: err.message || "Vazifalarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/assignments/${id}`);
      setToast({ message: "Vazifa o'chirildi!", type: 'success' });
      fetchAssignments();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignments-page">
      <h2>Vazifalar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ Vazifa qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="assignments-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Boshlanish</th>
              <th>Tugash</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(assignments) || assignments.length === 0) ? (
              <tr><td colSpan="5">Vazifalar topilmadi</td></tr>
            ) : assignments.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.title}</td>
                <td>{a.startDate?.slice(0,10)}</td>
                <td>{a.endDate?.slice(0,10)}</td>
                <td>
                  <button onClick={() => { setEditItem(a); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(a.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddAssignmentModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchAssignments}
      />
      <EditAssignmentModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchAssignments}
        assignment={editItem}
      />
    </div>
  );
};

export default Assignments;

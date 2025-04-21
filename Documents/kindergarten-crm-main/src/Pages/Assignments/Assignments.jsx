import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddAssignmentModal from "./AddAssignmentModal";
import EditAssignmentModal from "./EditAssignmentModal";
import AssignmentSubmissionsModal from "./AssignmentSubmissionsModal";
import SubmitAssignmentModal from "./SubmitAssignmentModal";
import "./Assignments.css";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [submissionsAssignment, setSubmissionsAssignment] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitAssignment, setSubmitAssignment] = useState(null);

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
      <div className="students-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Vazifalar</h2>
          <button className="add-btn" style={{ height: '40px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => setShowAdd(true)}>+ Vazifa qo'shish</button>
        </div>
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
                <th>Guruh</th>
                <th>O'qituvchi</th>
                <th>Boshlanish</th>
                <th>Tugash</th>
                <th>Status</th>
                <th>Topshirilganlar</th>
                <th>O'rtacha baho</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {(!Array.isArray(assignments) || assignments.length === 0) ? (
                <tr><td colSpan="10">Vazifalar topilmadi</td></tr>
              ) : assignments.map((a, i) => (
                <tr key={a.assignment_id || a.id || i}>
                  <td>{i + 1}</td>
                  <td>{a.title}</td>
                  <td>{a.group?.name || a.group_name || '-'}</td>
                  <td>{a.teacher?.name || a.teacher_name || '-'}</td>
                  <td>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</td>
                  <td>{a.due_date ? new Date(a.due_date).toLocaleDateString() : '-'}</td>
                  <td>{a.status || (a.due_date && new Date(a.due_date) < new Date() ? 'Yopiq' : 'Ochiq')}</td>
                  <td>{Array.isArray(a.submissions) ? `${a.submissions.length}` : '-'}</td>
                  <td>{Array.isArray(a.submissions) && a.submissions.length > 0 ? (
                    (a.submissions.reduce((sum, s) => sum + (parseFloat(s.grade) || 0), 0) / a.submissions.length).toFixed(2)
                  ) : '-'}</td>
                  <td>
                    <button onClick={() => { setEditItem(a); setShowEdit(true); }}>Tahrirlash</button>
                    <button onClick={() => handleDelete(a.assignment_id || a.id)} className="delete-btn">O'chirish</button>
                    <button onClick={() => { setSubmissionsAssignment(a); setShowSubmissions(true); }}>Topshiriqlar</button>
                    <button onClick={() => { setSubmitAssignment(a); setShowSubmit(true); }}>Topshirish</button>
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
        <AssignmentSubmissionsModal
          open={showSubmissions}
          onClose={() => setShowSubmissions(false)}
          assignment={submissionsAssignment}
        />
        <SubmitAssignmentModal
          open={showSubmit}
          onClose={() => setShowSubmit(false)}
          assignment={submitAssignment}
          onSuccess={fetchAssignments}
        />
      </div>
    </div>
  );
};

export default Assignments;

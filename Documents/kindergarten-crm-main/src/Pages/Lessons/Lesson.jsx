import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddLessonModal from "./AddLessonModal";
import EditLessonModal from "./EditLessonModal";
import "./Lesson.css";

const Lesson = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/lesson");
      let data = res.data;
      if (!Array.isArray(data)) {
        data = Array.isArray(data.results) ? data.results : [];
      }
      setLessons(data);
    } catch (err) {
      setError("Darslarni olishda xatolik");
      setToast({ message: err.message || "Darslarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/lesson/${id}`);
      setToast({ message: "Dars o'chirildi!", type: 'success' });
      fetchLessons();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lesson-page">
      <h2>Darslar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ Dars qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="lesson-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Kurs</th>
              <th>O'qituvchi</th>
              <th>Izoh</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(lessons) || lessons.length === 0) ? (
              <tr><td colSpan="6">Darslar topilmadi</td></tr>
            ) : lessons.map((l, i) => (
              <tr key={l.id}>
                <td>{i + 1}</td>
                <td>{l.name}</td>
                <td>{l.courseName || l.courseId}</td>
                <td>{l.teacherName || l.teacherId}</td>
                <td>{l.description}</td>
                <td>
                  <button onClick={() => { setEditItem(l); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(l.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddLessonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchLessons}
      />
      <EditLessonModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchLessons}
        lesson={editItem}
      />
    </div>
  );
};

export default Lesson;

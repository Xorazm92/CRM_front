import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddCourseModal from "./AddCourseModal";
import EditCourseModal from "./EditCourseModal";
import "./Course.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/course");
      let data = res.data;
      // Defensive: ensure data is always an array
      if (!Array.isArray(data)) {
        data = Array.isArray(data.results) ? data.results : [];
      }
      setCourses(data);
    } catch (err) {
      setError("Kurslarni olishda xatolik");
      setToast({ message: err.message || "Kurslarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/course/${id}`);
      setToast({ message: "Kurs o'chirildi!", type: 'success' });
      fetchCourses();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-page">
      <h2>Kurslar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ Kurs qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Izoh</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(!Array.isArray(courses) || courses.length === 0) ? (
              <tr><td colSpan="4">Kurslar topilmadi</td></tr>
            ) : courses.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>
                  <button onClick={() => { setEditItem(c); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(c.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddCourseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchCourses}
      />
      <EditCourseModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchCourses}
        course={editItem}
      />
    </div>
  );
};

export default Course;

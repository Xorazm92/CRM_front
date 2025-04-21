import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import EditCourseModal from "./EditCourseModal";
import AddCourseModal from "./AddCourseModal";
import "./Course.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/course");
      let data = res.data.data; // <-- Faqat massivni olamiz
      if (!Array.isArray(data)) {
        data = [];
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

  useEffect(() => {
    const filtered = courses.filter(course => course.name.toLowerCase().includes(filter.toLowerCase()));
    setFilteredCourses(filtered);
  }, [courses, filter]);

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
    <div className="home-wrapper">
      <div className="course-page">
        <div className="course-header-row">
          <div>
            <h2 className="course-title">Kurslar jadvali</h2>
            <div className="course-subtitle">Barcha kurslarni boshqarish va tahrirlash</div>
          </div>
          <button className="add-btn" onClick={() => setShowAdd(true)}>
            <span className="add-btn-icon">＋</span> Kurs qo'shish
          </button>
        </div>
        <div className="course-actions-row">
          <input
            type="text"
            className="filter-input"
            placeholder="🔍 Kurs nomi bo'yicha qidirish..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
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
              {filteredCourses.length === 0 ? (
                <tr><td colSpan="4" className="empty-row">Kurslar topilmadi</td></tr>
              ) : filteredCourses.map((c, i) => (
                <tr key={c.course_id} className="table-row">
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <button onClick={() => { setEditItem(c); setShowEdit(true); }} className="edit-btn">Tahrirlash</button>
                    <button onClick={() => handleDelete(c.course_id)} className="delete-btn">O'chirish</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <EditCourseModal
          open={showEdit}
          onClose={() => { setShowEdit(false); setEditItem(null); }}
          onSuccess={fetchCourses}
          course={editItem}
        />
        <AddCourseModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSuccess={fetchCourses}
        />
      </div>
    </div>
  );
};

export default Course;

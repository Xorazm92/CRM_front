import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import EditCourseModal from "./EditCourseModal";
import AddCourseModal from "./AddCourseModal";
import images from "../../images";
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
    <div className="groups-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>Kurslar jadvali</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          <button className="add-btn" onClick={() => setShowAdd(true)}>
            <span className="add-btn-icon">＋</span> Kurs qo'shish
          </button>
        </div>
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
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Izoh</th>
              <th>Davomiyligi</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr><td colSpan="6" className="empty-row">Kurslar topilmadi</td></tr>
            ) : filteredCourses.map((c, i) => (
              <tr key={c.course_id} className="table-row">
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>{c.duration} oy</td>
                <td>{c.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</td>
                <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => { setEditItem(c); setShowEdit(true); }} className="edit-btn" title="Tahrirlash" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <img src={images.pen_icon} alt="edit" width={22} height={22} />
                  </button>
                  <button onClick={() => handleDelete(c.course_id)} className="delete-btn" title="O'chirish" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <img src={images.deleteIcon} alt="delete" width={22} height={22} />
                  </button>
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
  );
};

export default Course;

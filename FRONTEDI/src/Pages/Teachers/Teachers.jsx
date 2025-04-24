import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import "./Teachers.css";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/teacher");
      setTeachers(res.data || []);
    } catch (err) {
      setError("O'qituvchilarni olishda xatolik");
      setToast({ message: err.message || "O'qituvchilarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/teacher/${id}`);
      setToast({ message: "O'qituvchi o'chirildi!", type: 'success' });
      fetchTeachers();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teachers-page">
      <h2>O'qituvchilar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ O'qituvchi qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="teachers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>F.I.Sh.</th>
              <th>Tug‘ilgan sana</th>
              <th>Jinsi</th>
              <th>Kontakt</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr><td colSpan="6">O'qituvchilar topilmadi</td></tr>
            ) : teachers.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.full_name || t.name}</td>
                <td>{t.birthdate || t.birthDate}</td>
                <td>{t.gender}</td>
                <td>{t.contact}</td>
                <td>
                  <button onClick={() => { setEditItem(t); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(t.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddTeacherModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onTeacherAdded={fetchTeachers}
      />
      <EditTeacherModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        teacher={editItem}
        onTeacherEdited={fetchTeachers}
      />
    </div>
  );
};

export default Teachers;

import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import "./Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/group");
      setGroups(res.data || []);
    } catch (err) {
      setError("Guruhlarni olishda xatolik");
      setToast({ message: err.message || "Guruhlarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/group/${id}`);
      setToast({ message: "Guruh o'chirildi!", type: 'success' });
      fetchGroups();
    } catch (err) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="groups-page">
      <h2>Guruhlar</h2>
      <button className="add-btn" onClick={() => setShowAdd(true)}>+ Guruh qo'shish</button>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      {loading ? (
        <div className="loader-center"><ClipLoader color="#009688" size={40} /></div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : (
        <table className="groups-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nomi</th>
              <th>Boshlanish sanasi</th>
              <th>O'qituvchi</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr><td colSpan="5">Guruhlar topilmadi</td></tr>
            ) : groups.map((g, i) => (
              <tr key={g.id}>
                <td>{i + 1}</td>
                <td>{g.name}</td>
                <td>{g.start_date || g.startDate}</td>
                <td>{g.teacher_name || g.teacherName || g.teacher || "-"}</td>
                <td>
                  <button onClick={() => { setEditItem(g); setShowEdit(true); }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(g.id)} className="delete-btn">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddGroupModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onGroupAdded={fetchGroups}
      />
      <EditGroupModal
        isOpen={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        group={editItem}
        onGroupEdited={fetchGroups}
      />
    </div>
  );
};

export default Groups;

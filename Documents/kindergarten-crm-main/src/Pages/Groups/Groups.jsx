import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import AddGroupMemberModal from "./AddGroupMemberModal";
import GroupDetailModal from "./GroupDetailModal";
import AddGroupTeacherModal from "./AddGroupTeacherModal";
import "./Groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberGroup, setAddMemberGroup] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailGroupId, setDetailGroupId] = useState(null);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [addTeacherGroup, setAddTeacherGroup] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/groups");
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
      }
      setGroups(data);
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

  const handleAddMembers = (group) => {
    setAddMemberGroup(group);
    setShowAddMember(true);
  };

  return (
    <div className="home-wrapper">
      <div className="groups-page">
        <div className="groups-header-row">
          <div>
            <h2 className="groups-title">Guruhlar</h2>
            <div className="groups-subtitle">Barcha guruhlarni boshqarish va tahrirlash</div>
          </div>
          <button className="add-btn" onClick={() => setShowAdd(true)}>
            <span className="add-btn-icon">＋</span> Guruh qo'shish
          </button>
        </div>
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
                <th>Batafsil</th>
                <th>O'qituvchi biriktirish</th>
                <th>A'zolar</th>
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr><td colSpan="8" className="empty-row">Guruhlar topilmadi</td></tr>
              ) : (
                groups.map((g, i) => (
                  <tr key={g.id || g.group_id || g._id || i} className="table-row">
                    <td>{i + 1}</td>
                    <td>{g.name}</td>
                    <td>{g.start_date || g.startDate}</td>
                    <td>{g.teacher_name || g.teacherName || g.teacher || "-"}</td>
                    <td>
                      <button onClick={() => { setEditItem(g); setShowEdit(true); }} className="edit-btn"><span className="icon-edit" /> Tahrirlash</button>
                      <button onClick={() => handleDelete(g.id)} className="delete-btn"><span className="icon-delete" /> O'chirish</button>
                    </td>
                    <td>
                      <button onClick={() => { setDetailGroupId(g.id || g.group_id || g._id); setShowDetail(true); }} className="add-member-btn">Batafsil</button>
                    </td>
                    <td>
                      <button onClick={() => { setAddTeacherGroup(g); setShowAddTeacher(true); }} className="add-member-btn">O'qituvchi qo'shish</button>
                    </td>
                    <td><button onClick={() => handleAddMembers(g)} className="add-member-btn">A'zo qo'shish</button></td>
                  </tr>
                ))
              )}
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
        <AddGroupMemberModal
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
          groupId={addMemberGroup?.id || addMemberGroup?.group_id || addMemberGroup?._id}
          onMembersAdded={fetchGroups}
        />
        <GroupDetailModal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          groupId={detailGroupId}
        />
        <AddGroupTeacherModal
          isOpen={showAddTeacher}
          onClose={() => setShowAddTeacher(false)}
          groupId={addTeacherGroup?.id || addTeacherGroup?.group_id || addTeacherGroup?._id}
          onTeacherAdded={fetchGroups}
        />
      </div>
    </div>
  );
};

export default Groups;

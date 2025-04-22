import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import Button from "../../components/Button/Button";
import Filter from "../../components/Filter/Filter";
import DataTable from "../../components/DataTable/DataTable";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import AddGroupMemberModal from "./AddGroupMemberModal";
import GroupDetailModal from "./GroupDetailModal";
import AddGroupTeacherModal from "./AddGroupTeacherModal";
import "./Groups.css";

const Groups = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/groups");
      setGroups(res.data.data || []);
    } catch (err) {
      setError(err.message || "Guruhlarni yuklashda xatolik");
      setToast({ message: err.message || "Guruhlarni yuklashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/group/${id}`);
      fetchGroups();
      setToast({ message: "Guruh muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "O‘chirishda xatolik", type: "error" });
    }
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleGroupAdded = () => {
    fetchGroups();
    setToast({ message: "Guruh muvaffaqiyatli qo‘shildi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleGroupEdited = () => {
    fetchGroups();
    setToast({ message: "Guruh muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const openDetailModal = (group) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddMemberModal = (group) => {
    setSelectedGroup(group);
    setAddMemberModalOpen(true);
  };
  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddTeacherModal = (group) => {
    setSelectedGroup(group);
    setAddTeacherModalOpen(true);
  };
  const closeAddTeacherModal = () => {
    setAddTeacherModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="groups-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>Guruhlar jadvali</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          {/* <Button onClick={() => setIsAddModalOpen(true)}>Qo‘shish</Button> */}
          <Button onFilterClick={toggleFilter} />
        </div>
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <AddGroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGroupAdded={handleGroupAdded}
      />
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        group={selectedGroup}
        onGroupEdited={handleGroupEdited}
      />
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <DataTable 
          data={groups} 
          type="groups" 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onDetail={(group) => openDetailModal(group)} 
          onAddMember={(group) => openAddMemberModal(group)} 
          onAddTeacher={(group) => openAddTeacherModal(group)} 
        />
      )}
      {detailModalOpen && (
        <GroupDetailModal isOpen={detailModalOpen} groupId={selectedGroup?.group_id || selectedGroup?.id} onClose={closeDetailModal} />
      )}
      {addMemberModalOpen && (
        <AddGroupMemberModal isOpen={addMemberModalOpen} groupId={selectedGroup?.group_id || selectedGroup?.id} onClose={closeAddMemberModal} />
      )}
      {addTeacherModalOpen && (
        <AddGroupTeacherModal isOpen={addTeacherModalOpen} groupId={selectedGroup?.group_id || selectedGroup?.id} onClose={closeAddTeacherModal} />
      )}
    </div>
  );
};

export default Groups;

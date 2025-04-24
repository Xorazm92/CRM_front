// types.tsx
interface GroupType {
  id?: string;
  group_id?: string;
  name?: string;
  [key: string]: any;
}

export { GroupType };

// Groups.tsx
import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import instance from "../../api/axios";
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

const Groups: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
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
    } catch (err: any) {
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

  const handleEdit = (group: GroupType) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/group/${id}`);
      fetchGroups();
      setToast({ message: "Guruh muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err: any) {
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

  const openDetailModal = (group: GroupType) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddMemberModal = (group: GroupType) => {
    setSelectedGroup(group);
    setAddMemberModalOpen(true);
  };
  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddTeacherModal = (group: GroupType) => {
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
      <Spin spinning={loading}>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <DataTable 
            data={groups} 
            type="groups" 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onDetail={(group: GroupType) => openDetailModal(group)} 
            onAddMember={(group: GroupType) => openAddMemberModal(group)} 
            onAddTeacher={(group: GroupType) => openAddTeacherModal(group)} 
          />
        )}
      </Spin>
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

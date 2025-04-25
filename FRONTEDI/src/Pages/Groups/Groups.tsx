// types.tsx
interface Groups {
  group_id?: string;
  name?: string;
  [key: string]: any;
}

export { Groups };

// Groups.tsx
import React, { useState, useEffect } from "react";
import { Spin, message, Button } from "antd";
import { fetchGroups, deleteGroup } from "../../api/groups";
import Toast from "../../components/Toast";
import Filter from "../../components/Filter/Filter";
import DataTable from "../../components/DataTable/DataTable";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import AddGroupMemberModal from "./AddGroupMemberModal";
import GroupDetailModal from "./GroupDetailModal";
import AddGroupTeacherModal from "./AddGroupTeacherModal";
import { Groups } from "../../types/models";
import { Navigate } from "react-router-dom";
import { getEntityId } from "../../utils/getEntityId";

const Groups: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState<Groups[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Groups | null>(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);

  const fetchGroupsHandler = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGroups();
      // group_id mappingni professional qilish
      const mapped = (data || []).map((g: any) => ({
        ...g,
        group_id: getEntityId(g),
      }));
      setGroups(mapped);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || "Guruhlarni yuklashda xatolik");
      setToast({ message: err.message || err.response?.data?.message || "Guruhlarni yuklashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsHandler();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleEdit = (group: Groups) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (group_id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await deleteGroup(group_id);
      fetchGroupsHandler();
      setToast({ message: "Guruh muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || err.message || "O‘chirishda xatolik", type: "error" });
    }
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleGroupAdded = () => {
    fetchGroupsHandler();
    setToast({ message: "Guruh muvaffaqiyatli qo‘shildi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleGroupEdited = () => {
    fetchGroupsHandler();
    setToast({ message: "Guruh muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const openDetailModal = (group: Groups) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddMemberModal = (group: Groups) => {
    setSelectedGroup(group);
    setAddMemberModalOpen(true);
  };
  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
    setSelectedGroup(null);
  };
  const openAddTeacherModal = (group: Groups) => {
    setSelectedGroup(group);
    setAddTeacherModalOpen(true);
  };
  const closeAddTeacherModal = () => {
    setAddTeacherModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
    <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    <div className="flex items-center justify-between gap-2 mb-4">
      <h1 className="text-xl font-bold">Guruhlar jadvali</h1>
      <div className="flex gap-2 items-center">
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            Yangi guruh qo'oshish
          </Button>
          {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      {/* <div className="flex gap-2 items-center">
        <Button onClick={() => setIsAddModalOpen(true)} />
        <Button onClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div> */}
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
            onDelete={(group: Groups) => handleDelete(getEntityId(group))}
            onDetail={(group: Groups) => openDetailModal(group)} 
            onAddMember={(group: Groups) => openAddMemberModal(group)} 
            onAddTeacher={(group: Groups) => openAddTeacherModal(group)} 
          />
        )}
      </Spin>
      {detailModalOpen && (
        <GroupDetailModal isOpen={detailModalOpen} groupId={getEntityId(selectedGroup)} onClose={closeDetailModal} />
      )}
      {addMemberModalOpen && (
        <AddGroupMemberModal isOpen={addMemberModalOpen} groupId={getEntityId(selectedGroup)} onClose={closeAddMemberModal} />
      )}
      {addTeacherModalOpen && (
        <AddGroupTeacherModal isOpen={addTeacherModalOpen} groupId={getEntityId(selectedGroup)} onClose={closeAddTeacherModal} />
      )}
    </div>
  );
};

export default Groups;

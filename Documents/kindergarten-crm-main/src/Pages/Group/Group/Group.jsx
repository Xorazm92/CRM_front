import React, { useState, useEffect } from "react";
import "./Group.css";
import Filter from "../../../components/Filter/Filter";
import Button from "../../../components/Button/Button";
import DataTable from "../../../components/DataTable/DataTable";
import Pagination from "../../../components/Pagination/Pagination";
import Toast from "../../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import AddGroupModal from "./AddGroupModal";
import EditGroupModal from "./EditGroupModal";
import instance from "../../../api/axios";

function Group() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/group");
      setGroups(res.data.data || []);
    } catch (err) {
      setError(err.message || "Guruhlarni yuklashda xatolik");
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

  return (
    <div className="p_wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>Guruhlar jadvali</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Yangi guruh qo‘shish</Button>
        <Button onFilterClick={toggleFilter} showSaveCancel={false} />
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
        <DataTable data={groups} type="groups" onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <footer className="footer">
        <Pagination />
      </footer>
    </div>
  );
}

export default Group;

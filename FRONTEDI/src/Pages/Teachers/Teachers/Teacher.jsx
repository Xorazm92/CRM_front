import React, { useState, useEffect } from "react";
import "./Teacher.css";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import DataTable from "../../../components/DataTable/DataTable";
import instance from "../../../api/axios";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import Toast from "../../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";

function Teacher() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/teacher");
      setTeachers(res.data.data || []);
    } catch (err) {
      setError(err.message || "O'qituvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/teacher/${id}`);
      fetchTeachers();
      setToast({ message: "O‘qituvchi muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "O‘chirishda xatolik", type: "error" });
    }
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleTeacherAdded = () => {
    fetchTeachers();
    setToast({ message: "O‘qituvchi muvaffaqiyatli qo‘shildi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleTeacherEdited = () => {
    fetchTeachers();
    setToast({ message: "O‘qituvchi muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  return (
    <div className="teachers_wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>O’qituvchilar jadvali</h1>
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          {/* <Button onClick={() => setIsAddModalOpen(true)}>Yangi o‘qituvchi qo‘shish</Button> */}
          <Button onFilterClick={toggleFilter} />
        </div>
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTeacherAdded={handleTeacherAdded}
      />
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedTeacher}
        onTeacherEdited={handleTeacherEdited}
      />
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <DataTable data={teachers} type="teachers" onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Teacher;

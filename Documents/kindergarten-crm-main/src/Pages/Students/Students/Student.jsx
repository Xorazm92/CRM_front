import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import "./Student.css";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import instance from "../../../api/axios";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import Toast from "../../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";

const StudentPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/student");
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.message || "O'quvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/student/${id}`);
      fetchStudents();
      setToast({ message: "O‘quvchi muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "O‘chirishda xatolik", type: "error" });
    }
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleStudentAdded = () => {
    fetchStudents();
    setToast({ message: "O‘quvchi muvaffaqiyatli qo‘shildi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleStudentEdited = () => {
    fetchStudents();
    setToast({ message: "O‘quvchi muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  return (
    <div className="studentss-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="header-student-page">
        <h1>O’quvchilar jadvali</h1>
        {/* Faqat o'ng tarafdagi qo'shish tugmasi qoldi */}
        <div style={{marginLeft:'auto', display:'flex', gap:'10px'}}>
          <Button onClick={() => setIsAddModalOpen(true)}>Qo‘shish</Button>
          <Button onFilterClick={toggleFilter} />
        </div>
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onStudentEdited={handleStudentEdited}
      />
      {loading ? (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'200px'}}>
          <ClipLoader color="#009688" size={40} />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <DataTable data={students} type="students" onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default StudentPage;

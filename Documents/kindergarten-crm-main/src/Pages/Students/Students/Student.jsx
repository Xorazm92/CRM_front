import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import "./Student.css";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import instance from "../../../api/axios";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";

const StudentPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
    } catch (err) {
      alert("O‘chirishda xatolik: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="studentss-wrapper">
      <div className="header-student-page">
        <h1>O’quvchilar jadvali</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Yangi o‘quvchi qo‘shish</Button>
        <Button onFilterClick={toggleFilter} />
        {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      </div>
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={fetchStudents}
      />
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onStudentEdited={fetchStudents}
      />
      {loading ? (
        <div>Yuklanmoqda...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <DataTable data={students} type="students" onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default StudentPage;

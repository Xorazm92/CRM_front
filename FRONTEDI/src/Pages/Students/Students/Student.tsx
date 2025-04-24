import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import instance from "../../../api/axios";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import Toast from "../../../components/Toast";
import { Spin } from "antd";

interface StudentType {
  id?: string | number;
  user_id?: string | number;
  name?: string;
  birthDate?: string;
  gender?: string;
  group?: string;
  attendance?: boolean;
  [key: string]: any;
}

const StudentPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/student");
      setStudents(res.data.data || []);
    } catch (err: any) {
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

  const handleEdit = (student: StudentType) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/student/${id}`);
      fetchStudents();
      setToast({ message: "O‘quvchi muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err: any) {
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
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">O’quvchilar jadvali</h1>
        <div className="ml-auto flex gap-2">
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
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <DataTable data={students} type="students" onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default StudentPage;

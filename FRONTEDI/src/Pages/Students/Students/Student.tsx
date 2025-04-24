import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import instance from "../../../api/axios";
import EditStudentModal from "./EditStudentModal";
import Toast from "../../../components/Toast";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

interface StudentType {
  user_id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  phone_number?: string;
  group_members?: any[];
  [key: string]: any;
}

const StudentPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchStudents = async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get(`/users?role=STUDENT&page=${page}&limit=${limit}`);
      // Mapping for table
      const mapped = (res.data.data || res.data || []).map((s: any) => ({
        user_id: s.user_id,
        name: s.name,
        lastname: s.lastname,
        middlename: s.middlename,
        birthdate: s.birthdate,
        gender: s.gender,
        address: s.address,
        phone_number: s.phone_number,
        group: s.group_members && s.group_members.length > 0 ? s.group_members[0].group?.name : '',
        status: s.status,
      }));
      setStudents(mapped);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(err.message || "O'quvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleEdit = (student: StudentType) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/api/v1/users/${id}`);
      fetchStudents();
      setToast({ message: "O‘quvchi muvaffaqiyatli o‘chirildi!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || "O‘chirishda xatolik", type: "error" });
    }
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
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">O’quvchilar jadvali</h1>
        <div className="flex gap-2 items-center">
          <Button type="primary" onClick={() => navigate("/students/add")}>
            Yangi o‘quvchi qo‘shish
          </Button>
          {isFilterOpen && <Filter closeFilter={toggleFilter} />}
        </div>
      </div>

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
      {/* Pagination UI */}
      <div className="flex justify-end mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-2 py-1 border rounded mx-1"
        >
          Oldingi
        </button>
        <span>{currentPage} / {Math.max(1, Math.ceil(total / pageSize))}</span>
        <button
          disabled={currentPage === Math.ceil(total / pageSize) || total === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-2 py-1 border rounded mx-1"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
};

export default StudentPage;

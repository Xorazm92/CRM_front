// Converted from Teachers/Teacher.jsx to Teachers/Teacher.tsx with TypeScript support
import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import instance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DataTable from "../../../components/DataTable/DataTable";
import { Button } from "antd/es";
import Toast from "../../../components/Toast";
import Filter from "../../../components/Filter/Filter";
import EditTeacherModal from './EditTeacherModal';

interface TeacherType {
  user_id?: string;
  _id?: string;
  id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthdate?: string;
  gender?: string;
  phone_number?: string;
  [key: string]: any;
}

const TeacherPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<TeacherType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get(`/users?role=teacher&page=${page}&limit=${limit}`);
      const mapped = (res.data.data || res.data || [])
        .filter((s: any) => s.role === 'teacher' || s.role === 'TEACHER')
        .map((s: any) => ({
          user_id: s.user_id,
          name: s.name,
          lastname: s.lastname,
          middlename: s.middlename,
          birthDate: s.birthdate,
          gender: s.gender,
          address: s.address,
          phone_number: s.phone_number,
          group: s.group_members && s.group_members.length > 0 ? s.group_members[0].group?.name : '',
          status: s.status,
        }));
      setTeachers(mapped);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      setError(err.message || "O'quvchilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Gender tag
  const genderTag = (gender?: string) => {
    if (!gender) return null;
    const g = gender.toLowerCase();
    if (g.includes("male") || g.includes("o‘g‘il")) return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-600">O‘g‘il bola</span>;
    if (g.includes("female") || g.includes("qiz")) return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-500">Qiz bola</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{gender}</span>;
  };

  const handleEdit = (teacher: TeacherType) => {
    navigate(`/teachers/edit/${teacher.user_id || teacher._id || teacher.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/users/${id}`);
      fetchTeachers();
      // Toast yoki message.success qo'shishingiz mumkin
    } catch (err: any) {
      // Toast yoki message.error qo'shishingiz mumkin
    }
  };
  const handleTeacherEdited = () => {
    fetchTeachers();
    setToast({ message: "O‘qtuvchi muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  function toggleFilter(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold">O’qituvchilar jadvali</h1>
        <div className="flex gap-2 items-center">
          <Button type="primary" onClick={() => navigate("/teachers/add")}>
            Yangi o‘qtuvchi qo‘shish
          </Button>
          {isFilterOpen && <Filter closeFilter={toggleFilter} />}
        </div>
      </div>

      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedStudent}
        onTeacherEdited={handleTeacherEdited}
      />
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <DataTable data={teachers} type="teachers" onEdit={handleEdit} onDelete={handleDelete} />
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

export default TeacherPage;


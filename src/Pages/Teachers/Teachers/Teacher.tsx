// Converted from Teachers/Teacher.jsx to Teachers/Teacher.tsx with TypeScript support
import React, { useState, useEffect } from "react";
import { Pagination, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import instance from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/DataTable/DataTable";
import Button from "../../../components/Button/Button";
import Toast from "../../../components/Toast";
import Filter from "../../../components/Filter/Filter";
import EditTeacherModal from './EditTeacherModal';
import TeacherDetailModal from './TeacherDetailModal';

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
  address?: string;
  group?: string;
  status?: string;
  [key: string]: any;
}

const TeacherPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailTeacher, setDetailTeacher] = useState<TeacherType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get(`/users?role=TEACHER&page=${page}&limit=${limit}`);
      const mapped = (res.data.data || res.data || [])
        .filter((s: Record<string, unknown>) => s.role === 'teacher' || s.role === 'TEACHER')
        .map((s: Record<string, any>) => ({
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
      setError(err.message || "O'qituvchilarni yuklashda xatolik");
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
    if (g.includes("male") || g.includes("o'g'il")) return <span className="gender-tag male">O'g'il bola</span>;
    if (g.includes("female") || g.includes("qiz")) return <span className="gender-tag female">Qiz bola</span>;
    return <span className="gender-tag">{gender}</span>;
  };

  const handleEdit = (teacher: TeacherType) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O'chirishga ishonchingiz komilmi?")) return;
    try {
      await instance.delete(`/users/${id}`);
      fetchTeachers();
      setToast({ message: "O'qituvchi muvaffaqiyatli o'chirildi!", type: "success" });
      setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
    } catch (err: any) {
      // Extract backend error message if available
      let userMessage = "O'chirishda xatolik";
      const backendMsg = err?.response?.data?.message || err?.message || "";
      if (backendMsg.includes("Foreign key constraint")) {
        userMessage = "O'qituvchini o'chirishning iloji yo'q: avval unga bog'liq dars, attendance yoki xabar (notification) yozuvlarini o'chirib tashlang!";
      } else if (backendMsg.includes("Superadminni o'chirish mumkin emas")) {
        userMessage = "Superadmin foydalanuvchini o'chirish mumkin emas!";
      } else if (backendMsg) {
        userMessage = backendMsg;
      }
      setToast({ message: userMessage, type: "error" });
      setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
    }
  };

  const handleTeacherEdited = () => {
    fetchTeachers();
    setToast({ message: "O'qtuvchi muvaffaqiyatli tahrirlandi!", type: "success" });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleDetail = (teacher: TeacherType) => {
    setDetailTeacher(teacher);
    setIsDetailModalOpen(true);
  };
  
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  return (
    <div className="teacher-page-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="teacher-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="teacher-title" style={{ margin: 0 }}>O'qituvchilar jadvali</h1>
        <Button onFilterClick={toggleFilter} />
      </div>
      {isFilterOpen && <Filter closeFilter={toggleFilter} />}
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedTeacher}
        onTeacherEdited={handleTeacherEdited}
      />
      <TeacherDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        teacher={detailTeacher}
      />
      {loading ? (
        <div className="teacher-spinner-wrapper">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="teacher-error-message">{error}</div>
      ) : (
        <DataTable data={teachers} type="teachers" onEdit={handleEdit} onDelete={handleDelete} onDetail={handleDetail} />
      )}
      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '15', '20', '50']}
            />

      </div>
    </div>
  );
};

export default TeacherPage;
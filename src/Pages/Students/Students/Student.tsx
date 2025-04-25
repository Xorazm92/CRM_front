import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable/DataTable";
import Button from "../../../components/Button/Button";
import Filter from "../../../components/Filter/Filter";
import { getUsers, deleteStudent } from "../../../api/users";
import EditStudentModal from "./EditStudentModal";
import Toast from "../../../components/Toast";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ViewStudentModal from "./ViewStudentModal";

interface GroupMemberType {
  group?: {
    name?: string;
  };
  // kerak bo'lsa, boshqa fieldlar ham qo'shiladi
}

export interface StudentType {
  user_id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  phone_number?: string;
  group_members?: GroupMemberType[];
  [key: string]: unknown;
}

const StudentPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<StudentType | null>(null);
  const navigate = useNavigate();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchStudents = async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const res = await getUsers({ role: "STUDENT", page, limit });
      // UNIVERSAL BACKEND RESPONSE HANDLING
      let studentsArr: any[] = [];
      if (Array.isArray(res)) {
        studentsArr = res;
      } else if (Array.isArray(res.data)) {
        studentsArr = res.data;
      } else if (Array.isArray(res.results)) {
        studentsArr = res.results;
      } else if (res.data && Array.isArray(res.data.data)) {
        studentsArr = res.data.data;
      } else {
        studentsArr = [];
      }
      const mapped = studentsArr
        .filter((s: Record<string, unknown>) => s.role === 'student' || s.role === 'STUDENT')
        .map((s: Record<string, any>) => ({
          user_id: s.user_id || s.id || s._id,
          name: s.name,
          lastname: s.lastname,
          middlename: s.middlename,
          birthDate: s.birthdate,
          gender: s.gender === 'MALE' ? "O'g'il bola" : s.gender === 'FEMALE' ? 'Qiz bola' : s.gender,
          address: s.address,
          phone_number: s.phone_number,
          group: Array.isArray(s.group_members) && s.group_members.length > 0
            ? s.group_members.map((gm: any) => gm.group?.name).filter(Boolean).join(', ')
            : (s.group?.name || s.group_name || ''),
          status: s.status,
        }));
      setStudents(mapped);
      setTotal(
        res.total || res.count || (res.data && res.data.total) || studentsArr.length || 0
      );
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

  const handleView = (student: StudentType) => {
    setViewStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;
    try {
      await deleteStudent(id);
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
    <div className="student-page-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="student-title" style={{ margin: 0 }}>O‘quvchilar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button type="primary" onClick={() => navigate("/students/add")}>+ Qo'shish</Button>
          {isFilterOpen && <Filter closeFilter={toggleFilter} />}
        </div>
      </div>

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onStudentEdited={handleStudentEdited}
      />
      <ViewStudentModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} student={viewStudent} />
      {loading ? (
        <div className="student-spinner-wrapper">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="student-error-message">{error}</div>
      ) : (
        <DataTable data={students} type="students" onEdit={(person) => handleEdit(person as StudentType)} onDelete={(id) => typeof id === "string" ? handleDelete(id) : undefined} onDetail={(person) => handleView(person as StudentType)} />
      )}
      <div className="student-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn"
        >
          Oldingi
        </button>
        <span>{currentPage} / {Math.max(1, Math.ceil(total / pageSize))}</span>
        <button
          disabled={currentPage === Math.ceil(total / pageSize) || total === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
};

export default StudentPage;

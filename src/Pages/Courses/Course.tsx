import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import EditCourseModal from "./EditCourseModal";
import AddCourseModal from "./AddCourseModal";
import { Table, Input, Spin, Button } from "antd";
import icons from "../../images/icons";
import ButtonComponent from "../../components/Button/Button";
import "./Course.css";

interface CourseType {
  course_id: string | number;
  name: string;
  description: string;
  duration: number;
  status: string;
}

const Course: React.FC = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<CourseType | null>(null);
  const [filter, setFilter] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/course");
      let data = res.data.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setCourses(data);
    } catch (err: any) {
      setError("Kurslarni olishda xatolik");
      setToast({ message: err.message || "Kurslarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(filter.toLowerCase()));

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/course/${id}`);
      setToast({ message: "Kurs o'chirildi!", type: 'success' });
      fetchCourses();
    } catch (err: any) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { title: 'Izoh', dataIndex: 'description', key: 'description' },
    { title: 'Davomiyligi', key: 'duration', render: (_: any, record: CourseType) => `${record.duration} oy` },
    { title: 'Status', key: 'status', render: (_: any, record: CourseType) => record.status === 'ACTIVE' ? 'Faol' : 'Nofaol' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: CourseType) => (
        <span className="course-table-actions">
          <Button type="link" onClick={() => { setEditItem(record); setShowEdit(true); }}>
            Tahrirlash
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.course_id)}>
            O'chirish
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Kurslar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="course-header-add-btn">
            <ButtonComponent showAdd={true} onAddClick={() => setShowAdd(true)} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Input
          placeholder="🔍 Kurs nomi bo'yicha qidirish..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spin size="large" /></div>
      ) : error ? (
        <div className="text-red-600 font-semibold">{error}</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredCourses}
          pagination={false}
          rowKey={record => String(record.course_id)}
          className="bg-white rounded shadow"
        />
      )}
      <EditCourseModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchCourses}
        course={editItem}
      />
      <AddCourseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default Course;

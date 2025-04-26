import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import EditCourseModal from "./EditCourseModal";
import AddCourseModal from "./AddCourseModal";
import ViewCourseModal from "./ViewCourseModal";
import { Table, Input, Spin, Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
  const [viewItem, setViewItem] = useState<CourseType | null>(null);
  const [showView, setShowView] = useState(false);
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
    { 
      title: 'Nomi', 
      dataIndex: 'name', 
      key: 'name',
      render: (_: any, record: CourseType) => (
        <a style={{ cursor: 'pointer', fontWeight: 500 }} onClick={() => { setViewItem(record); setShowView(true); }}>{record.name}</a>
      )
    },
    { title: 'Izoh', dataIndex: 'description', key: 'description', render: (text: string) => <span style={{ color: '#555' }}>{text}</span> },
    { title: 'Davomiyligi', key: 'duration', render: (_: any, record: CourseType) => <Tag color="blue">{record.duration} oy</Tag> },
    { title: 'Status', key: 'status', render: (_: any, record: CourseType) => record.status === 'ACTIVE' ? <Tag color="green">Faol</Tag> : <Tag color="red">Nofaol</Tag> },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: CourseType) => (
        <span className="course-table-actions">
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditItem(record); setShowEdit(true); }} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.course_id)} />
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="student-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Kurslar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>
            Yangi kurs
          </Button>
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
          pagination={{ pageSize: 10 }}
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
      <ViewCourseModal
        open={showView}
        onClose={() => { setShowView(false); setViewItem(null); }}
        course={viewItem}
      />
    </div>
  );
};

export default Course;

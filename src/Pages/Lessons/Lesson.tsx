import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import AddLessonModal from "./AddLessonModal";
import EditLessonModal from "./EditLessonModal";
import AttendanceModal from "./AttendanceModal";
import { Table, Input, Spin, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import icons from "../../images/icons";
import ButtonComponent from "../../components/Button/Button";
import "./lessons.css";

interface LessonType {
  lesson_id?: string;
  id?: string;
  topic: string;
  group_id: string;
  lesson_date?: string;
  recording_path: string;
}

const Lesson: React.FC = () => {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" }>({ message: '', type: 'success' });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<LessonType | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [attendanceLesson, setAttendanceLesson] = useState<LessonType | null>(null);
  const [filter, setFilter] = useState("");

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/lesson");
      let data = res.data;
      let lessonsArray = Array.isArray(data.data) ? data.data : [];
      setLessons(lessonsArray);
    } catch (err: any) {
      setError("Darslarni olishda xatolik");
      setToast({ message: err.message || "Darslarni olishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
    instance.get('/groups').then(res => {
      let data = res.data.data || [];
      setGroups(data);
    });
  }, []);

  const getGroupName = (group_id: string) => {
    const g = groups.find(g => g.group_id === group_id || g._id === group_id);
    return g ? g.name : group_id;
  };

  const filteredLessons = lessons.filter(lesson => lesson.topic.toLowerCase().includes(filter.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/lesson/${id}`);
      setToast({ message: "Dars o'chirildi!", type: 'success' });
      fetchLessons();
    } catch (err: any) {
      setToast({ message: err.message || "O'chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Mavzu', dataIndex: 'topic', key: 'topic' },
    { title: 'Guruh', key: 'group', render: (_: any, record: LessonType) => getGroupName(record.group_id) },
    { title: 'Sana', key: 'lesson_date', render: (_: any, record: LessonType) => record.lesson_date ? new Date(record.lesson_date).toLocaleString() : '' },
    { title: 'Yozuv yo‘li', dataIndex: 'recording_path', key: 'recording_path' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: LessonType) => (
        <span className="lesson-table-actions">
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditItem(record); setShowEdit(true); }} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.lesson_id || record.id || "")} />
          <Button type="default" onClick={() => setAttendanceLesson(record)} style={{marginLeft: 4}}>Davomat</Button>
        </span>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="lesson-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Darslar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="lesson-header-add-btn">
            <ButtonComponent showAdd={true} onAddClick={() => setShowAdd(true)} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <Input
          placeholder="🔍 Mavzu bo'yicha qidirish..."
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
          dataSource={filteredLessons}
          pagination={false}
          rowKey={record => String(record.lesson_id || record.id)}
          className="bg-white rounded shadow"
        />
      )}
      <EditLessonModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditItem(null); }}
        onSuccess={fetchLessons}
        lesson={editItem}
      />
      <AddLessonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchLessons}
      />
      <AttendanceModal
        open={!!attendanceLesson}
        lesson={attendanceLesson}
        groupId={attendanceLesson?.group_id}
        onClose={() => setAttendanceLesson(null)}
        onSuccess={fetchLessons}
      />
    </div>
  );
};

export default Lesson;

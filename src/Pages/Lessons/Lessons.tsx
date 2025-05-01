import React, { useEffect, useState } from 'react';
import { Table, Modal, Form, Input, DatePicker, Select, Spin, message } from 'antd';
import ButtonComponent from '../../components/Button/Button';
import instance from '../../api/axios';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddLessonModal from './AddLessonModal';
import EditLessonModal from './EditLessonModal';
import './lessons.css';
import { useAuthStore } from '../../store/useAuthStore';

interface LessonType {
  lesson_id: string;
  topic: string;
  lesson_date: string;
  group_id: string;
  group?: { name: string; group_id: string };
  file_name?: string;
  file_path?: string;
}

interface GroupType {
  group_id: string;
  name: string;
}

const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<LessonType | null>(null);

  const user = useAuthStore(state => state.user);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      let params: any = {};
      if (user?.role === 'teacher' && user?.user_id) {
        params.teacher_id = user.user_id;
      }
      const res = await instance.get('/lesson', { params });
      
      // Serverdan kelgan ma'lumotlarni tekshirib olish
      let lessonsData = Array.isArray(res.data) ? res.data : res.data.data || [];
      
      // Agar group objekti yo'q bo'lsa, groups ma'lumotlaridan qo'shib qo'yamiz
      if (lessonsData.length > 0 && groups.length > 0) {
        lessonsData = lessonsData.map(lesson => {
          // Agar lesson.group yo'q yoki lesson.group.name yo'q bo'lsa
          if (!lesson.group || !lesson.group.name) {
            const foundGroup = groups.find(g => g.group_id === lesson.group_id);
            if (foundGroup) {
              return {
                ...lesson,
                group: {
                  name: foundGroup.name,
                  group_id: foundGroup.group_id
                }
              };
            }
          }
          return lesson;
        });
      }
      
      setLessons(lessonsData);
      console.log("Lessons data:", lessonsData); // Debug uchun
    } catch (err) {
      console.error("Error fetching lessons:", err);
      message.error('Darslarni olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await instance.get('/groups');
      const groupsData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setGroups(groupsData);
      console.log("Groups data:", groupsData); // Debug uchun
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      fetchLessons();
    }
  }, [groups]);

  const handleDelete = async (lessonId: string) => {
    Modal.confirm({
      title: "Darsni o'chirishni tasdiqlaysizmi?",
      okText: "Ha, o'chirish",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk: async () => {
        setLoading(true);
        try {
          await instance.delete(`/lesson/${lessonId}`);
          message.success("Dars muvaffaqiyatli o'chirildi!");
          fetchLessons();
        } catch (err: any) {
          message.error(err.response?.data?.message || err.message || "O'chirishda xatolik");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      title: 'Dars mavzusi',
      dataIndex: 'topic',
      key: 'topic',
    },
    {
      title: 'Guruh',
      key: 'group',
      render: (_, record: LessonType) => {
        // Guruh ma'lumotlarini ko'rsatish uchun tekshirish
        if (record.group && record.group.name) {
          return record.group.name;
        } else if (record.group_id) {
          const foundGroup = groups.find(g => g.group_id === record.group_id);
          return foundGroup ? foundGroup.name : '-';
        }
        return '-';
      },
    },
    {
      title: 'Sana',
      dataIndex: 'lesson_date',
      key: 'lesson_date',
      render: (val: string) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: 'Fayl',
      key: 'file',
      render: (_, record: LessonType) => {
        // Fayl ma'lumotlarini ko'rsatish uchun tekshirish
        if (record.file_path) {
          return (
            <a 
              href={record.file_path} 
              target="_blank" 
              rel="noopener noreferrer"
              className="file-link"
            >
              {record.file_name || 'Yuklab olish'}
            </a>
          );
        }
        return '-';
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, rec: LessonType) => (
        <span className="lesson-table-actions">
          <button
            className="edit-btn"
            title="Tahrirlash"
            onClick={() => { setEditItem(rec); setShowEdit(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}
          >
            <EditOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          </button>
          <button
            className="delete-btn"
            title="O'chirish"
            onClick={() => handleDelete(rec.lesson_id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="lessons-page">
      <div className="lesson-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="text-xl font-bold mb-2 md:mb-0">Darslar jadvali</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ButtonComponent showAdd={true} onAddClick={() => setShowAdd(true)} />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={lessons}
          columns={columns}
          rowKey={r => r.lesson_id}
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      <AddLessonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={() => { setShowAdd(false); fetchLessons(); }}
      />
      {editItem && (
        <EditLessonModal
          open={showEdit}
          lesson={editItem}
          onClose={() => { setShowEdit(false); setEditItem(null); }}
          onSuccess={() => { setShowEdit(false); setEditItem(null); fetchLessons(); }}
        />
      )}
    </div>
  );
};

export default Lessons;
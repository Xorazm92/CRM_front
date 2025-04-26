import React, { useEffect, useState } from 'react';
import { Table, Modal, Form, Input, DatePicker, Select, Spin, message } from 'antd';
import ButtonComponent from '../../components/Button/Button';
import instance from '../../api/axios';
import dayjs from 'dayjs';
import AddLessonModal from './AddLessonModal';
import EditLessonModal from './EditLessonModal';
import './lessons.css';

interface LessonType {
  lesson_id: string;
  topic: string;
  lesson_date: string;
  group_id: string;
  group?: { name: string };
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

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await instance.get('/lesson');
      setLessons(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      message.error('Darslarni olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await instance.get('/groups');
      setGroups(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchLessons();
    fetchGroups();
  }, []);

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
      dataIndex: ['group', 'name'],
      key: 'group',
      render: (_: any, rec: LessonType) => rec.group?.name || '-',
    },
    {
      title: 'Sana',
      dataIndex: 'lesson_date',
      key: 'lesson_date',
      render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Fayl',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (_: any, rec: LessonType) => rec.file_path ? (
        <a href={rec.file_path} target="_blank" rel="noopener noreferrer">{rec.file_name || 'Yuklab olish'}</a>
      ) : '-',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, rec: LessonType) => (
        <span className="lesson-table-actions">
          <button className="edit-btn" onClick={() => { setEditItem(rec); setShowEdit(true); }}>Tahrirlash</button>
          <button className="delete-btn" onClick={() => handleDelete(rec.lesson_id)}>O'chirish</button>
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
          pagination={{ pageSize: 15 }}
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

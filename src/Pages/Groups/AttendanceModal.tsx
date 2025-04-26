import React, { useEffect, useState } from 'react';
import { Modal, Table, Spin, message } from 'antd';
import instance from '../../api/axios';

interface AttendanceModalProps {
  visible: boolean;
  groupId: string;
  onClose: () => void;
}

interface AttendanceRecord {
  id: string;
  date: string;
  lesson_name?: string;
  student: {
    user_id: string;
    full_name: string;
  };
  status: string;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ visible, groupId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<{user_id: string, full_name: string}[]>([]);
  
  useEffect(() => {
    if (visible) {
      fetchAttendance();
      fetchStudents();
    }
    // eslint-disable-next-line
  }, [visible]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await instance.get(`/attendance?group_id=${groupId}`);
      setData(res.data.data || []);
    } catch (err: any) {
      message.error('Davomatni olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await instance.get(`/groups/${groupId}`);
      const members = res.data.data?.members || [];
      setStudents(members.map((m: any) => ({ user_id: m.user_id, full_name: m.full_name })));
    } catch (err: any) {
      setStudents([]);
    }
  };

  // Pivot: Sana/dars bo'yicha qatorda, talabalar ustunda
  // Unikal dars/sana bo'yicha guruhlash
  const lessons = Array.from(new Set(data.map(r => r.date + (r.lesson_name || '')))).map(key => {
    const first = data.find(r => (r.date + (r.lesson_name || '')) === key);
    return {
      key,
      date: first?.date,
      lesson_name: first?.lesson_name || '-',
    };
  });

  const rows = lessons.map(lesson => {
    const row: any = {
      date: lesson.date,
      lesson_name: lesson.lesson_name,
    };
    students.forEach(student => {
      const att = data.find(r => r.date === lesson.date && r.student.user_id === student.user_id);
      row[student.user_id] = att ? (att.status === 'PRESENT' ? '✔️' : '❌') : '';
    });
    return row;
  });

  const columns = [
    { title: 'Sana', dataIndex: 'date', key: 'date', fixed: 'left' as const },
    { title: 'Dars', dataIndex: 'lesson_name', key: 'lesson_name', fixed: 'left' as const },
    ...students.map(st => ({
      title: st.full_name,
      dataIndex: st.user_id,
      key: st.user_id,
      align: 'center' as const,
      width: 120,
    }))
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      width={Math.max(700, 200 + students.length * 120)}
      title="Guruh Davomati (Pivot)"
      footer={null}
    >
      {loading ? <Spin /> : (
        <Table
          dataSource={rows}
          columns={columns}
          rowKey={r => r.date + r.lesson_name}
          scroll={{ x: true }}
          pagination={{ pageSize: 10 }}
        />
      )}
    </Modal>
  );
};

export default AttendanceModal;

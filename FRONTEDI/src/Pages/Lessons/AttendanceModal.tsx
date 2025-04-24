// Converted from AttendanceModal.jsx to AttendanceModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Modal, Table, Select, Button, Spin, message } from "antd";
import instance from "../../api/axios";

const statusOptions = [
  { value: "PRESENT", label: "Keldi" },
  { value: "ABSENT", label: "Kelmadi" },
  { value: "LATE", label: "Kechikdi" },
  { value: "EXCUSED", label: "Sababli" },
];

interface AttendanceModalProps {
  open: boolean;
  onClose: () => void;
  lesson: any;
  groupId: string;
  onSuccess?: () => void;
}

interface StudentType {
  user_id?: string;
  id?: string;
  name?: string;
  lastname?: string;
}
interface AttendanceType {
  student_id: string;
  status: string;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ open, onClose, lesson, groupId, onSuccess }) => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !groupId) return;
    setLoading(true);
    instance.get(`/groups/${groupId}`)
      .then(res => {
        const members = res.data.data.students || [];
        setStudents(members);
        return instance.get(`/attendance?lesson_id=${lesson.lesson_id || lesson.id}`);
      })
      .then(res => {
        setAttendance(res.data || []);
      })
      .catch(() => setError("Ma'lumotlarni yuklashda xatolik"))
      .finally(() => setLoading(false));
  }, [open, groupId, lesson]);

  const handleChange = (student_id: string, status: string) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.student_id === student_id);
      if (exists) {
        return prev.map(a => a.student_id === student_id ? { ...a, status } : a);
      } else {
        return [...prev, { student_id, status }];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const lessonId = lesson.lesson_id || lesson.id;
    const payload = attendance
      .filter(a => a.status && a.student_id && lessonId)
      .map(a => ({ lesson_id: lessonId, student_id: a.student_id, status: a.status }));
    if (payload.length === 0) {
      message.warning("Hech bir o‘quvchiga status tanlanmagan yoki ma'lumotlar to‘liq emas!");
      setSaving(false);
      return;
    }
    try {
      await Promise.all(payload.map(item => instance.post("/attendance", item)));
      message.success("Davomat saqlandi");
      onSuccess && onSuccess();
      onClose();
    } catch (err: any) {
      message.error("Saqlashda xatolik: " + (err?.response?.data?.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Ism', dataIndex: 'name', key: 'name' },
    { title: 'Familiya', dataIndex: 'lastname', key: 'lastname' },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: StudentType) => (
        <Select
          value={attendance.find(a => a.student_id === (record.user_id || record.id))?.status || ""}
          onChange={val => handleChange(record.user_id || record.id || '', val)}
          style={{ width: 120 }}
          disabled={saving || loading}
        >
          <Select.Option value="">Tanlang</Select.Option>
          {statusOptions.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
          ))}
        </Select>
      )
    }
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Davomat" destroyOnClose>
      {loading ? <Spin /> : error ? <div>{error}</div> : (
        <Table
          dataSource={students}
          columns={columns}
          rowKey={record => record.user_id || record.id}
          pagination={false}
        />
      )}
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose} disabled={saving}>Bekor qilish</Button>
        <Button type="primary" onClick={handleSave} loading={saving || loading}>Saqlash</Button>
      </div>
    </Modal>
  );
};

export default AttendanceModal;

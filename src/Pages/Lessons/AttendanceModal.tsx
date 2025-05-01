// Converted from AttendanceModal.jsx to AttendanceModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Modal, Table, Switch, Button, Spin, message } from "antd";
import instance from "../../api/axios";
import { EditOutlined } from "@ant-design/icons";
import "./attendance-modal.css";

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

const AttendanceModal: React.FC<AttendanceModalProps> = ({ open, onClose, lesson, groupId, onSuccess }) => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !groupId) return;
    setLoading(true);
    instance.get(`/groups/${groupId}`).then(res => {
      setStudents(res.data.data.students || []);
      return instance.get(`/attendance?lesson_id=${lesson.lesson_id || lesson.id}`);
    }).then(res => {
      const att: Record<string, boolean> = {};
      (res.data || []).forEach((a: any) => { att[a.student_id] = a.status === "PRESENT"; });
      setAttendance(att);
    }).finally(() => setLoading(false));
  }, [open, groupId, lesson]);

  const handleSwitch = (student_id: string, checked: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [student_id]: checked
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const lessonId = lesson.lesson_id || lesson.id;
    const payload = students.map(s => ({
      lesson_id: lessonId,
      student_id: s.user_id || s.id,
      status: attendance[s.user_id || s.id] ? "PRESENT" : "ABSENT"
    }));
    try {
      await Promise.all(payload.map(item => instance.post("/attendance", item)));
      message.success("Davomat saqlandi");
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      message.error("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: "#", render: (_: any, __: any, idx: number) => idx + 1, width: 50 },
    { 
      title: "O‘quvchi ismi", 
      render: (_: any, r: StudentType) => (r.name + " " + (r.lastname || "")),
      width: 250
    },
    { 
      title: "Vaqti", 
      render: () => lesson.lesson_date ? new Date(lesson.lesson_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
      width: 80
    },
    {
      title: " ",
      render: () => (
        <Button type="link" icon={<EditOutlined />} />
      ),
      width: 50
    },
    {
      title: "Keldi",
      render: (_: any, r: StudentType) => (
        <Switch
          checked={!!attendance[r.user_id || r.id]}
          onChange={checked => handleSwitch(r.user_id || r.id || '', checked)}
        />
      ),
      width: 80
    }
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Davomat" destroyOnClose width={700}>
      {loading ? <Spin /> : (
        <Table
          dataSource={students}
          columns={columns}
          pagination={false}
          rowKey={r => r.user_id || r.id || ""}
        />
      )}
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} disabled={saving}>Bekor qilish</Button>
        <Button type="primary" loading={saving} onClick={handleSave} style={{ marginLeft: 8 }}>Saqlash</Button>
      </div>
    </Modal>
  );
};

export default AttendanceModal;

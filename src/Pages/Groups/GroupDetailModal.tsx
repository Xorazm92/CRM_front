// Migration placeholder for GroupDetailModal.jsx to .tsx
// The actual code will be migrated from the .jsx file and refactored to TypeScript.

import React from "react";
import { Modal, Descriptions, Spin, Collapse, List, Typography } from "antd";
import instance from "../../api/axios";

interface Teacher {
  user_id: string;
  full_name?: string;
  name?: string;
  [key: string]: any;
}

interface Course {
  course_id: string;
  name: string;
  [key: string]: any;
}

interface Student {
  user_id: string;
  full_name?: string;
  name?: string;
  phone_number?: string;
  [key: string]: any;
}

interface GroupDetailModalProps {
  groupId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({ groupId, isOpen, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [group, setGroup] = React.useState<any>(null);
  const [error, setError] = React.useState<string>("");
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = React.useState(false);
  const [studentsError, setStudentsError] = React.useState<string>("");

  React.useEffect(() => {
    if (isOpen && groupId) {
      setLoading(true);
      setError("");
      instance.get(`/groups/${groupId}`)
        .then(res => setGroup(res.data.data))
        .catch(err => setError(err?.response?.data?.message || err.message || "Xatolik"))
        .finally(() => setLoading(false));
      setLoadingStudents(true);
      setStudentsError("");
      // Fallback: group_members endpoint yo'q bo'lsa, group_members?group_id=... ishlatamiz
      instance.get(`/group_members?group_id=${groupId}`).then(res => {
        setStudents(Array.isArray(res.data.data) ? res.data.data.map((m: any) => m.user) : []);
      }).catch(err => {
        setStudentsError(err?.response?.data?.message || err.message || "O'quvchilarni olishda xatolik");
        setStudents([]);
      }).finally(() => setLoadingStudents(false));
    } else if (!isOpen) {
      setGroup(null);
      setError("");
      setStudents([]);
      setStudentsError("");
    }
  }, [isOpen, groupId]);

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruh tafsilotlari" destroyOnClose>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin size="large" /></div>
      ) : error ? (
        <div style={{ color: 'red', padding: 24 }}>{error}</div>
      ) : group ? (
        <>
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Nomi">{group.name}</Descriptions.Item>
            <Descriptions.Item label="Tavsif">{group.description}</Descriptions.Item>
            <Descriptions.Item label="Status">{group.status === 'ACTIVE' ? 'Faol' : group.status === 'INACTIVE' ? 'Nofaol' : group.status}</Descriptions.Item>
            <Descriptions.Item label="Kurs">{group.course?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="O'qituvchi">{group.teacher?.full_name || group.teacher?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="Boshlanish sanasi">{group.start_date || '-'}</Descriptions.Item>
          </Descriptions>
          <Collapse style={{ marginTop: 24 }}>
            <Collapse.Panel header="Guruhdagi o'quvchilar" key="students">
              {loadingStudents ? (
                <Spin />
              ) : studentsError ? (
                <Typography.Text type="danger">{studentsError}</Typography.Text>
              ) : students.length === 0 ? (
                <Typography.Text type="secondary">O'quvchilar topilmadi</Typography.Text>
              ) : (
                <List
                  dataSource={students}
                  renderItem={s => (
                    <List.Item key={s.user_id}>
                      <b>{s.full_name || s.name}</b> {s.phone_number ? `- ${s.phone_number}` : ""}
                    </List.Item>
                  )}
                />
              )}
            </Collapse.Panel>
          </Collapse>
        </>
      ) : (
        <div style={{ padding: 24 }}>Ma'lumot topilmadi</div>
      )}
    </Modal>
  );
};

export default GroupDetailModal;

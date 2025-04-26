import React, { useEffect, useState } from "react";
import { Modal, List, Spin, Typography } from "antd";
import instance from "../../api/axios";

interface CourseType {
  course_id: string | number;
  name: string;
  description: string;
  duration: number;
  status: string;
}

interface GroupType {
  _id: string;
  name: string;
  teacher_name?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  course: CourseType | null;
}

const ViewCourseModal: React.FC<Props> = ({ open, onClose, course }) => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && course) {
      setLoading(true);
      instance.get(`/group?course_id=${course.course_id}`)
        .then(res => {
          setGroups(res.data.data || []);
        })
        .catch(() => setGroups([]))
        .finally(() => setLoading(false));
    } else {
      setGroups([]);
    }
  }, [open, course]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={course ? `Kurs haqida ma'lumot: ${course.name}` : "Kurs haqida ma'lumot"}
      footer={null}
    >
      {course ? (
        <div>
          <Typography.Paragraph><b>Nomi:</b> {course.name}</Typography.Paragraph>
          <Typography.Paragraph><b>Izoh:</b> {course.description}</Typography.Paragraph>
          <Typography.Paragraph><b>Davomiyligi:</b> {course.duration} oy</Typography.Paragraph>
          <Typography.Paragraph><b>Status:</b> {course.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</Typography.Paragraph>
          <Typography.Title level={5} style={{ marginTop: 24 }}>Ushbu kursga tegishli guruhlar:</Typography.Title>
          {loading ? (
            <Spin />
          ) : groups.length === 0 ? (
            <Typography.Text type="secondary">Guruhlar topilmadi</Typography.Text>
          ) : (
            <List
              dataSource={groups}
              renderItem={g => (
                <List.Item key={g._id}>
                  <b>{g.name}</b> {g.teacher_name ? `- O'qituvchi: ${g.teacher_name}` : ""}
                </List.Item>
              )}
            />
          )}
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewCourseModal;

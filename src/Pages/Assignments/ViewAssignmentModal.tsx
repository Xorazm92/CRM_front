import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Tag, Divider, Statistic, Row, Col, Button } from "antd";
import instance from "../../api/axios";
import dayjs from "dayjs";

interface ViewAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
}

const ViewAssignmentModal: React.FC<ViewAssignmentModalProps> = ({ open, onClose, assignment }) => {
  const [stats, setStats] = useState<{ total: number; graded: number }>({ total: 0, graded: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && assignment) {
      setLoading(true);
      instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`)
        .then(res => {
          const submissions = res.data.data || [];
          setStats({
            total: submissions.length,
            graded: submissions.filter((s: any) => s.grade !== null && s.grade !== undefined && s.grade !== '').length
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const isPast = dayjs(assignment.due_date).isBefore(dayjs());

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Topshiriq tafsilotlari"
      footer={<Button onClick={onClose}>Yopish</Button>}
      width={600}
      destroyOnClose
      centered
      maskClosable
      confirmLoading={loading}
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Sarlavha">{assignment.title}</Descriptions.Item>
        <Descriptions.Item label="Tavsif">{assignment.description || '-'}</Descriptions.Item>
        <Descriptions.Item label="Guruh">{assignment.group?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="Deadline">
          <Tag color={isPast ? "red" : "blue"}>{dayjs(assignment.due_date).format("YYYY-MM-DD HH:mm")}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={assignment.status === 'ACTIVE' ? 'green' : 'red'}>{assignment.status === 'ACTIVE' ? 'Faol' : 'Nofaol'}</Tag>
        </Descriptions.Item>
        {assignment.file_path && (
          <Descriptions.Item label="Fayl">
            <a href={assignment.file_path} target="_blank" rel="noopener noreferrer">Yuklab olish</a>
          </Descriptions.Item>
        )}
      </Descriptions>
      <Divider />
      <Row gutter={32} justify="center">
        <Col><Statistic title="Yuborilgan javoblar" value={stats.total} /></Col>
        <Col><Statistic title="Baholangan javoblar" value={stats.graded} /></Col>
      </Row>
    </Modal>
  );
};

export default ViewAssignmentModal;

import React from "react";
import { Modal, Typography, Descriptions, List, Tag, Divider } from "antd";
import { TeamOutlined, UserOutlined, CalendarOutlined, BookOutlined } from "@ant-design/icons";

interface GroupDetailModalProps {
  open: boolean;
  onClose: () => void;
  group: any; // Guruhning to'liq ma'lumotlari (API /groups/:id/full dan)
}

const GroupDetailModal: React.FC<GroupDetailModalProps> = ({ open, onClose, group }) => {
  // Guruh ma'lumotlari hali kelmagan bo'lsa yoki yuklanayotgan bo'lsa
  if (!group && open) {
    return (
      <Modal open={open} onCancel={onClose} footer={null} width={600} title={<><TeamOutlined /> Guruh tafsilotlari</>}>
        <Typography.Text>Yuklanmoqda...</Typography.Text>
      </Modal>
    );
  }
  if (!group) return null;
  return (
    <Modal open={open} onCancel={onClose} onOk={onClose} title={<><TeamOutlined /> Guruh tafsilotlari</>} footer={null} width={600}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label={<><BookOutlined /> Guruh nomi</>}>{group.name}</Descriptions.Item>
        <Descriptions.Item label={<><UserOutlined /> O'qituvchi</>}>{group.teacher_name || <Tag color="default">Biriktirilmagan</Tag>}</Descriptions.Item>
        <Descriptions.Item label={<><CalendarOutlined /> Status</>}>{group.status}</Descriptions.Item>
        <Descriptions.Item label="Kurs">{group.course_name}</Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" style={{ marginTop: 24 }}>A'zolar</Divider>
      {Array.isArray(group.members) && group.members.length > 0 ? (
        <List
          size="small"
          bordered
          dataSource={group.members}
          renderItem={(m: any) => (
            <List.Item>
              <UserOutlined /> {m.name} {m.lastname} <Tag color={m.status === "ACTIVE" ? "green" : "red"} style={{ marginLeft: 10 }}>{m.status}</Tag>
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text type="secondary">A'zolar topilmadi</Typography.Text>
      )}
      <Divider orientation="left" style={{ marginTop: 24 }}>Darslar</Divider>
      {Array.isArray(group.lessons) && group.lessons.length > 0 ? (
        <List
          size="small"
          bordered
          dataSource={group.lessons}
          renderItem={(l: any) => (
            <List.Item>
              <BookOutlined /> {l.topic} <span style={{ marginLeft: 10 }}><CalendarOutlined /> {l.lesson_date ? new Date(l.lesson_date).toLocaleDateString() : ''}</span>
            </List.Item>
          )}
        />
      ) : (
        <Typography.Text type="secondary">Darslar topilmadi</Typography.Text>
      )}
    </Modal>
  );
};

export default GroupDetailModal;

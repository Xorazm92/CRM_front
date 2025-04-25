import React from "react";
import { Modal, Descriptions, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface TeacherDetailModalProps {
  open: boolean;
  onClose: () => void;
  teacher: any;
}

const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({ open, onClose, teacher }) => {
  if (!teacher) return null;
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="O'qituvchi haqida batafsil">
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <Avatar size={80} src={teacher.avatar} icon={<UserOutlined />} />
        <div>
          <h2 style={{ margin: 0 }}>{teacher.name} {teacher.lastname}</h2>
          <div style={{ color: '#888' }}>{teacher.specialty || ''}</div>
        </div>
      </div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Ism">{teacher.name}</Descriptions.Item>
        <Descriptions.Item label="Familiya">{teacher.lastname}</Descriptions.Item>
        {teacher.middlename && <Descriptions.Item label="Sharif">{teacher.middlename}</Descriptions.Item>}
        <Descriptions.Item label="Tug'ilgan sana">{teacher.birthDate ? new Date(teacher.birthDate).toLocaleDateString('uz-UZ') : ''}</Descriptions.Item>
        <Descriptions.Item label="Jinsi">{teacher.gender}</Descriptions.Item>
        <Descriptions.Item label="Telefon">{teacher.phone_number}</Descriptions.Item>
        <Descriptions.Item label="Manzil">{teacher.address}</Descriptions.Item>
        {teacher.specialty && <Descriptions.Item label="Mutaxassisligi">{teacher.specialty}</Descriptions.Item>}
        {teacher.experience && <Descriptions.Item label="Tajriba">{teacher.experience}</Descriptions.Item>}
        {teacher.group && <Descriptions.Item label="Guruh">{teacher.group}</Descriptions.Item>}
        <Descriptions.Item label="Status">{teacher.status}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TeacherDetailModal;

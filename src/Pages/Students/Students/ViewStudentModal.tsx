import React from "react";
import { Modal, Descriptions } from "antd";
import type { StudentType } from "./Student";

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentType | null;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({ isOpen, onClose, student }) => {
  if (!student) return null;
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O‘quvchi ma’lumotlari" destroyOnClose>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Ism">{student.name}</Descriptions.Item>
        <Descriptions.Item label="Familiya">{student.lastname}</Descriptions.Item>
        <Descriptions.Item label="Otasining ismi">{student.middlename}</Descriptions.Item>
        <Descriptions.Item label="Tug‘ilgan sana">{student.birthDate}</Descriptions.Item>
        <Descriptions.Item label="Jinsi">{student.gender}</Descriptions.Item>
        <Descriptions.Item label="Manzil">{student.address}</Descriptions.Item>
        <Descriptions.Item label="Telefon raqam">{student.phone_number}</Descriptions.Item>
        <Descriptions.Item label="Guruh">{student.group?.name}</Descriptions.Item>
        <Descriptions.Item label="Foydalanuvchi nomi">{student.username}</Descriptions.Item>
        <Descriptions.Item label="Parol">{student.password || '***'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewStudentModal;

// Zamonaviy, professional va type-safe AddTeacherModal.tsx (Ant Design, TypeScript, backend integration)
import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import instance from "../../../api/axios";
import dayjs from "dayjs";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherAdded: () => void;
}

interface AddTeacherForm {
  full_name: string;
  birthdate: any;
  gender: string;
  contact: string;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onTeacherAdded }) => {
  const [form] = Form.useForm<AddTeacherForm>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: AddTeacherForm) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : undefined
      };
      await instance.post("/teacher", payload);
      message.success("O‘qituvchi muvaffaqiyatli qo‘shildi!");
      form.resetFields();
      onTeacherAdded();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || "Qo‘shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title="Yangi o‘qituvchi qo‘shish"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: '' }}
      >
        <Form.Item label="F.I.O" name="full_name" rules={[{ required: true, message: "Ism familiya majburiy!" }]}> <Input placeholder="To‘liq ism" /> </Form.Item>
        <Form.Item label="Tug‘ilgan sana" name="birthdate" rules={[{ required: true, message: "Tug‘ilgan sana majburiy!" }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        <Form.Item label="Jinsi" name="gender" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsini tanlang"> <Select.Option value="male">Erkak</Select.Option> <Select.Option value="female">Ayol</Select.Option> </Select> </Form.Item>
        <Form.Item label="Kontakt" name="contact" rules={[{ required: true, message: "Telefon raqam majburiy!" }, { pattern: /^\+?\d{9,15}$/, message: "Telefon raqam noto‘g‘ri!" }]}> <Input placeholder="Telefon raqam" /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>Qo‘shish</Button>
          <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherModal;

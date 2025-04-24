// Converted from AddTeacherModal.jsx to AddTeacherModal.tsx with full TypeScript support
import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherAdded?: () => void;
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
      await instance.post("/teacher", {
        full_name: values.full_name,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : undefined,
        gender: values.gender,
        contact: values.contact
      });
      message.success("O'qituvchi qo'shildi!");
      form.resetFields();
      onTeacherAdded && onTeacherAdded();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O'qituvchi qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="full_name" label="F.I.Sh." rules={[{ required: true, message: "Ism majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="birthdate" label="Tug‘ilgan sana" rules={[{ required: true, message: "Sana majburiy!" }]}> <DatePicker className="w-full" /> </Form.Item>
          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsi tanlang" options={[{ value: 'Erkak', label: 'Erkak' }, { value: 'Ayol', label: 'Ayol' }]} /> </Form.Item>
          <Form.Item name="contact" label="Kontakt" rules={[{ required: true, message: "Kontakt majburiy!" }]}> <Input /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddTeacherModal;

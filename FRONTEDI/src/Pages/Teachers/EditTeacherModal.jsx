import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";
import "./Teachers.css";

const EditTeacherModal = ({ isOpen, onClose, teacher, onTeacherEdited }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (teacher && isOpen) {
      form.setFieldsValue({
        full_name: teacher.full_name || teacher.name || "",
        birthdate: teacher.birthdate || teacher.birthDate ? (teacher.birthdate || teacher.birthDate) : undefined,
        gender: teacher.gender || "",
        contact: teacher.contact || ""
      });
    }
  }, [teacher, isOpen, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await instance.put(`/teacher/${teacher.id}`, {
        full_name: values.full_name,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : undefined,
        gender: values.gender,
        contact: values.contact
      });
      message.success("O'qituvchi yangilandi!");
      onTeacherEdited && onTeacherEdited();
      onClose();
    } catch (err) {
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O'qituvchini tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="full_name" label="F.I.Sh." rules={[{ required: true, message: "Ism majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="birthdate" label="Tug‘ilgan sana" rules={[{ required: true, message: "Sana majburiy!" }]}> <DatePicker className="w-full" /> </Form.Item>
          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsi tanlang" options={[{ value: 'Erkak', label: 'Erkak' }, { value: 'Ayol', label: 'Ayol' }]} /> </Form.Item>
          <Form.Item name="contact" label="Kontakt" rules={[{ required: true, message: "Kontakt majburiy!" }]}> <Input /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditTeacherModal;

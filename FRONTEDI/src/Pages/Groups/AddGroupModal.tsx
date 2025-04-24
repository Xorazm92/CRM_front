// Converted from AddGroupModal.jsx to AddGroupModal.tsx with full TypeScript support
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded?: () => void;
}

interface TeacherType {
  _id?: string;
  id?: string;
  full_name?: string;
  name?: string;
  username?: string;
  lastname?: string;
}

interface CourseType {
  _id?: string;
  id?: string;
  name: string;
}

interface AddGroupForm {
  name: string;
  description: string;
  course_id: string;
  status: string;
  start_date: any;
  teacher_id: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onGroupAdded }) => {
  const [form] = Form.useForm<AddGroupForm>();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    if (isOpen) {
      instance.get("/teacher").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setTeachers(data);
      });
      instance.get("/course").then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setCourses(data);
      });
    }
  }, [isOpen]);

  const handleFinish = async (values: AddGroupForm) => {
    if (!values.name || !values.course_id || !values.teacher_id || !values.start_date) {
      message.error("Barcha majburiy maydonlarni to‘ldiring");
      return;
    }
    if (!values.description || values.description.length < 10) {
      message.error("Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        course_id: values.course_id,
        status: values.status || "ACTIVE",
        start_date: values.start_date.format("YYYY-MM-DD"),
        teacher_id: values.teacher_id
      };
      await instance.post("/groups", payload);
      message.success("Guruh muvaffaqiyatli qo'shildi!");
      form.resetFields();
      if (onGroupAdded) onGroupAdded();
      if (onClose) onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Yangi guruh qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Guruh nomi majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Tavsif" rules={[{ required: true, min: 10, message: "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak" }]}> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="course_id" label="Kurs" rules={[{ required: true, message: "Kurs majburiy!" }]}> <Select placeholder="Kursni tanlang" options={courses.map(c => ({ value: c._id || c.id, label: c.name }))} /> </Form.Item>
          <Form.Item name="teacher_id" label="O'qituvchi" rules={[{ required: true, message: "O'qituvchi majburiy!" }]}> <Select placeholder="O'qituvchini tanlang" options={teachers.map(t => ({ value: t._id || t.id, label: t.full_name || t.name || t.username || t.lastname || 'No name' }))} /> </Form.Item>
          <Form.Item name="start_date" label="Boshlanish sanasi" rules={[{ required: true, message: "Boshlanish sana majburiy!" }]}> <DatePicker className="w-full" /> </Form.Item>
          <Form.Item name="status" label="Holat" initialValue="ACTIVE"> <Select options={[{ value: "ACTIVE", label: "Aktiv" }, { value: "INACTIVE", label: "Passiv" }]} /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddGroupModal;

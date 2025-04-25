// Converted from AddGroupModal.jsx to AddGroupModal.tsx with full TypeScript support
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { createGroup } from "../../api/groups";
import { fetchTeachers } from "../../api/teachers";
import { fetchCourses } from "../../api/courses";
import { Groups, GroupStatus } from "../../types/models";
import { getEntityId } from "../../utils/getEntityId";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupAdded?: () => void;
}

interface TeacherType {
  user_id: string;
  name: string;
  lastname: string;
}

interface CourseType {
  course_id: string;
  name: string;
}

interface AddGroupForm {
  name: string;
  description: string;
  course_id: string;
  status: GroupStatus;
  teacher_id: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, onGroupAdded }) => {
  const [form] = Form.useForm<AddGroupForm>();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers().then(data => {
        setTeachers(data.map((t) => ({ ...t, user_id: getEntityId(t), name: t.name, lastname: t.lastname })));
      });
      fetchCourses().then(data => {
        setCourses(data.map((c) => ({ ...c, course_id: getEntityId(c), name: c.name })));
      });
      form.resetFields();
    }
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const handleFinish = async (values: AddGroupForm) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        course_id: getEntityId(courses.find(c => getEntityId(c) === values.course_id)),
        teacher_id: getEntityId(teachers.find(t => getEntityId(t) === values.teacher_id)),
      };
      await createGroup(payload);
      message.success("Guruh muvaffaqiyatli qo'shildi!");
      onClose();
      if (onGroupAdded) onGroupAdded();
    } catch (err: any) {
      message.error("Guruhni qo'shishda xatolik: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Yangi guruh qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: GroupStatus.ACTIVE }}>
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Guruh nomi majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Tavsif" rules={[{ required: true, min: 10, message: "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak" }]}> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="course_id" label="Kurs" rules={[{ required: true, message: "Kurs majburiy!" }]}> 
            <Select 
              placeholder="Kursni tanlang" 
              options={courses.map(c => ({ value: getEntityId(c), label: c.name }))}
              showSearch
              optionFilterProp="label"
            /> 
          </Form.Item>
          <Form.Item name="teacher_id" label="O'qituvchi" rules={[{ required: true, message: "O'qituvchi majburiy!" }]}> 
            <Select 
              placeholder="O'qituvchini tanlang" 
              options={teachers.map(t => ({ value: getEntityId(t), label: t.name + ' ' + t.lastname }))}
              showSearch
              optionFilterProp="label"
            /> 
          </Form.Item>
          <Form.Item name="status" label="Holat"> <Select options={[{ value: GroupStatus.ACTIVE, label: "Aktiv" }, { value: GroupStatus.INACTIVE, label: "Passiv" }]} /> </Form.Item>
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

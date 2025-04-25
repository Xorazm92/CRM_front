// Converted from EditGroupModal.jsx to EditGroupModal.tsx with full TypeScript support
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";
import { getEntityId } from "../../utils/getEntityId";

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
  onGroupEdited?: () => void;
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

interface EditGroupForm {
  name: string;
  description: string;
  course_id: string;
  status: string;
  start_date: any;
  teacher_id: string;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ isOpen, onClose, group, onGroupEdited }) => {
  const [form] = Form.useForm<EditGroupForm>();
  const [loading, setLoading] = React.useState(false);
  const [teachers, setTeachers] = React.useState<TeacherType[]>([]);
  const [courses, setCourses] = React.useState<CourseType[]>([]);

  useEffect(() => {
    if (group && isOpen) {
      form.setFieldsValue({
        name: group.name || "",
        description: group.description || "",
        course_id: getEntityId(group.course || { course_id: group.course_id, id: group.courseId, _id: group.course?._id }) || "",
        status: group.status || "ACTIVE",
        start_date: group.start_date ? (typeof group.start_date === 'string' ? group.start_date : undefined) : group.startDate ? (typeof group.startDate === 'string' ? group.startDate : undefined) : undefined,
        teacher_id: getEntityId(group.teacher || { user_id: group.teacher_id, id: group.teacherId, _id: group.teacher?._id }) || ""
      });
    }
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
  }, [group, isOpen, form]);

  const handleFinish = async (values: EditGroupForm) => {
    if (!values.name || !values.description || !values.course_id || !values.status || !values.start_date || !values.teacher_id) {
      message.error("Barcha maydonlarni to‘ldiring");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        course_id: getEntityId(courses.find(c => getEntityId(c) === values.course_id)) || values.course_id,
        status: values.status,
        start_date: typeof values.start_date === 'string' ? values.start_date : values.start_date.format("YYYY-MM-DD"),
        teacher_id: getEntityId(teachers.find(t => getEntityId(t) === values.teacher_id)) || values.teacher_id
      };
      await instance.put(`/groups/${getEntityId(group)}`, payload);
      message.success("Guruh muvaffaqiyatli tahrirlandi!");
      onGroupEdited && onGroupEdited();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="Guruhni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Guruh nomi" rules={[{ required: true, message: "Guruh nomi majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Guruh tavsifi" rules={[{ required: true, message: "Tavsif majburiy!" }]}> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="course_id" label="Kurs" rules={[{ required: true, message: "Kurs majburiy!" }]}> <Select placeholder="Kursni tanlang" options={courses.map(c => ({ value: getEntityId(c), label: c.name }))} /> </Form.Item>
          <Form.Item name="status" label="Holat" rules={[{ required: true, message: "Holat majburiy!" }]} initialValue="ACTIVE"> <Select options={[{ value: "ACTIVE", label: "Aktiv" }, { value: "INACTIVE", label: "Noaktiv" }, { value: "COMPLETED", label: "Yakunlangan" }]} /> </Form.Item>
          <Form.Item name="start_date" label="Boshlanish sanasi" rules={[{ required: true, message: "Boshlanish sana majburiy!" }]}> <DatePicker className="w-full" /> </Form.Item>
          <Form.Item name="teacher_id" label="O'qituvchi" rules={[{ required: true, message: "O'qituvchi majburiy!" }]}> <Select placeholder="O'qituvchini tanlang" options={teachers.map(t => ({ value: getEntityId(t), label: t.full_name || t.name || t.username || t.lastname || 'No name' }))} /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditGroupModal;

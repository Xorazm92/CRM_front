// Converted from EditLessonModal.jsx to EditLessonModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Select, Spin, message } from "antd";
import instance from "../../api/axios";
import dayjs from "dayjs";

interface GroupType {
  group_id?: string;
  _id?: string;
  name: string;
  course_id?: string;
  teacher_id?: string;
}
interface CourseType {
  _id?: string;
  id?: string;
  name: string;
}
interface TeacherType {
  _id?: string;
  id?: string;
  full_name?: string;
}
interface EditLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lesson: any;
}
interface EditLessonForm {
  group_id: string;
  topic: string;
  lesson_date: any;
  recording_path: string;
}

const EditLessonModal: React.FC<EditLessonModalProps> = ({ open, onClose, onSuccess, lesson }) => {
  const [form] = Form.useForm<EditLessonForm>();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);

  useEffect(() => {
    if (open) {
      instance.get('/groups').then(res => setGroups(res.data.data || []));
      instance.get('/course').then(res => setCourses(res.data.data || []));
      instance.get('/teacher').then(res => setTeachers(res.data.data || []));
    }
  }, [open]);

  useEffect(() => {
    if (lesson && open) {
      form.setFieldsValue({
        group_id: lesson.group_id || '',
        topic: lesson.topic || '',
        lesson_date: lesson.lesson_date ? dayjs(lesson.lesson_date) : undefined,
        recording_path: lesson.recording_path || ''
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [lesson, open, form]);

  const selectedGroup = groups.find(g => g.group_id === form.getFieldValue('group_id') || g._id === form.getFieldValue('group_id'));
  const courseName = selectedGroup && courses.length ? (courses.find(c => c._id === selectedGroup.course_id || c.id === selectedGroup.course_id)?.name || selectedGroup.course_id) : '';
  const teacherName = selectedGroup && teachers.length ? (teachers.find(t => t._id === selectedGroup.teacher_id || t.id === selectedGroup.teacher_id)?.full_name || selectedGroup.teacher_id) : '';

  const handleFinish = async (values: EditLessonForm) => {
    if (!values.group_id || !values.topic || !values.lesson_date) {
      message.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...values,
        lesson_date: dayjs(values.lesson_date).toISOString()
      };
      await instance.patch(`/lesson/${lesson.lesson_id || lesson.id}` , payload);
      message.success("Dars tahrirlandi!");
      onSuccess && onSuccess();
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Darsni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh tanlang!" }]}> <Select disabled={loading} placeholder="Guruh tanlang"> {groups.map((g) => (
            <Select.Option key={g.group_id || g._id} value={g.group_id || g._id}>{g.name}</Select.Option>
          ))} </Select> </Form.Item>
          <Form.Item name="topic" label="Mavzu" rules={[{ required: true, message: "Mavzuni kiriting!" }]}> <Input disabled={loading} /> </Form.Item>
          <Form.Item name="lesson_date" label="Dars sanasi" rules={[{ required: true, message: "Sanani tanlang!" }]}> <DatePicker showTime className="w-full" disabled={loading} /> </Form.Item>
          <Form.Item name="recording_path" label="Yozuv yo‘li"> <Input disabled={loading} /> </Form.Item>
          <Form.Item label="Kurs">
            <Input value={courseName} disabled readOnly />
          </Form.Item>
          <Form.Item label="O'qituvchi">
            <Input value={teacherName} disabled readOnly />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditLessonModal;

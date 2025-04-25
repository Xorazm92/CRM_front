import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, Button, message, Spin } from "antd";
import { updateAttendance } from "../../api/attendance";
import { getEntityId } from "../../utils/getEntityId";

interface EditAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  attendance: any;
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({ open, onClose, onSuccess, attendance }) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      instance.get('/students'),
      instance.get('/lesson')
    ]).then(([studentsRes, lessonsRes]) => {
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.data || studentsRes.data?.results || []);
      setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : lessonsRes.data?.data || lessonsRes.data?.results || []);
    }).finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (attendance && open) {
      form.setFieldsValue({
        student_id: getEntityId(attendance.student) || attendance.student_id || attendance.student?.student_id || attendance.student?._id || attendance.student?.id || '',
        lesson_id: getEntityId(attendance.lesson) || attendance.lesson_id || attendance.lesson?.lesson_id || attendance.lesson?._id || attendance.lesson?.id || '',
        status: attendance.status || '',
        date: attendance.lesson?.lesson_date ? attendance.lesson.lesson_date : attendance.created_at ? attendance.created_at : undefined
      });
    }
  }, [attendance, open, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateAttendance(
        attendance.attendance_id || attendance.id,
        {
          student_id: getEntityId(values.student_id) || values.student_id,
          lesson_id: getEntityId(values.lesson_id) || values.lesson_id,
          status: values.status,
          date: values.date ? (typeof values.date === 'string' ? values.date : values.date.toISOString()) : undefined
        }
      );
      message.success("Davomat tahrirlandi!");
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Davomatni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="student_id" label="Talaba" rules={[{ required: true, message: "Talaba majburiy!" }]}> <Select placeholder="Talaba tanlang" options={students.map(s => ({ value: s.student_id || s._id || s.id, label: s.name + (s.lastname ? ' ' + s.lastname : '') }))} showSearch optionFilterProp="label" /> </Form.Item>
          <Form.Item name="lesson_id" label="Dars" rules={[{ required: true, message: "Dars majburiy!" }]}> <Select placeholder="Dars tanlang" options={lessons.map(l => ({ value: l.lesson_id || l._id || l.id, label: l.topic + (l.lesson_date ? ' (' + new Date(l.lesson_date).toLocaleDateString() + ')' : '') }))} showSearch optionFilterProp="label" /> </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> <Select placeholder="Status tanlang" options={[{ value: 'present', label: 'Kelgan' }, { value: 'absent', label: 'Kelmagan' }]} /> </Form.Item>
          <Form.Item name="date" label="Sana"> <DatePicker className="w-full" /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditAttendanceModal;

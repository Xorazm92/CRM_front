import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, Button, message, Spin } from "antd";
import dayjs from "dayjs";
import { updateAttendance } from "../../api/attendance";
import { getEntityId } from "../../utils/getEntityId";

interface EditAttendanceModalProps {
  open: boolean;
  record: any;
  onClose: () => void;
  onSuccess: () => void;
  groups?: any[];
  lessons?: any[];
  students?: any[];
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  open, record, onClose, onSuccess, groups = [], lessons = [], students = []
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Student va lesson optionsni har doim string value bilan yaratamiz
  const studentOptions = students.map(s => ({
    value: String(s.user_id || s.student_id || s._id || s.id),
    label: [s.name, s.lastname].filter(Boolean).join(' ') || String(s.user_id || s.student_id || s._id || s.id)
  }));
  const lessonOptions = lessons.map(l => ({
    value: String(l.lesson_id || l._id || l.id),
    label: l.topic + (l.lesson_date ? ' (' + new Date(l.lesson_date).toLocaleDateString() + ')' : '')
  }));

  useEffect(() => {
    if (record && open) {
      // Konsolga chiqaramiz
      // console.log('record.student:', record.student);
      // console.log('record.student_id:', record.student_id);
      // console.log('students:', students);
      let studentId = String(
        record.student?.user_id ||
        record.student_id ||
        record.user_id ||
        record.student?.student_id ||
        record.student?._id ||
        record.student?.id ||
        ""
      );
      // students optionsda mavjudligini tekshirish
      const studentObj = students.find(s =>
        String(s.user_id) === studentId ||
        String(s.student_id) === studentId ||
        String(s._id) === studentId ||
        String(s.id) === studentId
      );
      if (studentObj) {
        studentId = String(studentObj.user_id || studentObj.student_id || studentObj._id || studentObj.id);
      }
      let lessonId = String(record.lesson?.lesson_id || record.lesson_id || record.id || record.lesson?._id || record.lesson?.id || "");
      const lessonObj = lessons.find(l =>
        String(l.lesson_id) === lessonId || String(l._id) === lessonId || String(l.id) === lessonId
      );
      if (lessonObj) {
        lessonId = String(lessonObj.lesson_id || lessonObj._id || lessonObj.id);
      }
      form.setFieldsValue({
        student_id: studentId,
        lesson_id: lessonId,
        status: record.status || "",
        date: record.lesson?.lesson_date
          ? dayjs(record.lesson.lesson_date)
          : record.created_at
            ? dayjs(record.created_at)
            : undefined
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [record, open, form, students, lessons]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateAttendance(
        record.attendance_id || record.id,
        {
          student_id: getEntityId(values.student_id) || values.student_id,
          lesson_id: getEntityId(values.lesson_id) || values.lesson_id,
          status: values.status,
          date: values.date ? (typeof values.date === "string" ? values.date : values.date.toISOString()) : undefined
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
          <Form.Item name="student_id" label="Talaba" rules={[{ required: true, message: "Talaba majburiy!" }]}> 
            <Select
              placeholder="Talaba tanlang"
              options={studentOptions}
              showSearch
              optionFilterProp="children"
              loading={!students.length}
              filterOption={(input, option) => (option && typeof option.label === 'string') ? option.label.toLowerCase().includes(input.toLowerCase()) : false}
            />
          </Form.Item>
          <Form.Item name="lesson_id" label="Dars" rules={[{ required: true, message: "Dars majburiy!" }]}> 
            <Select
              placeholder="Dars tanlang"
              options={lessonOptions}
              showSearch
              optionFilterProp="children"
              loading={!lessons.length}
              filterOption={(input, option) => (option && typeof option.label === 'string') ? option.label.toLowerCase().includes(input.toLowerCase()) : false}
            />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> 
            <Select
              placeholder="Status tanlang"
              options={[
                { value: "PRESENT", label: "Kelgan" },
                { value: "ABSENT", label: "Kelmagan" },
                { value: "LATE", label: "Kechikkan" },
                { value: "EXCUSED", label: "Sababli" }
              ]}
            />
          </Form.Item>
          <Form.Item name="date" label="Sana">
            <DatePicker className="w-full" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditAttendanceModal;

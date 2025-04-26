import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, Button, message, Spin } from "antd";
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

  useEffect(() => {
    if (record && open) {
      form.setFieldsValue({
        student_id: getEntityId(record.student) || record.student_id || "",
        lesson_id: getEntityId(record.lesson) || record.lesson_id || "",
        status: record.status || "",
        date: record.lesson?.lesson_date ? record.lesson.lesson_date : record.created_at ? record.created_at : undefined
      });
    }
  }, [record, open, form]);

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
              options={students.map(s => ({
                value: s.student_id || s._id || s.id,
                label: s.name + (s.lastname ? ' ' + s.lastname : '')
              }))}
              showSearch
              optionFilterProp="label"
              loading={!students.length}
            />
          </Form.Item>
          <Form.Item name="lesson_id" label="Dars" rules={[{ required: true, message: "Dars majburiy!" }]}> 
            <Select
              placeholder="Dars tanlang"
              options={lessons.map(l => ({
                value: l.lesson_id || l._id || l.id,
                label: l.topic + (l.lesson_date ? ' (' + new Date(l.lesson_date).toLocaleDateString() + ')' : '')
              }))}
              showSearch
              optionFilterProp="label"
              loading={!lessons.length}
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

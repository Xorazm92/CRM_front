import React, { useState, useEffect } from "react";
import { createAttendance } from "../../api/attendance";
import { Modal, Form, Input, Button, Select } from "antd";
import "antd/dist/reset.css";
import { getEntityId } from "../../utils/getEntityId";

interface Student {
  _id: string;
  fullName: string;
  name: string;
}

interface FormValues {
  student_id: string;
  date: string;
  status: string;
}

interface Toast {
  message: string;
  type: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAttendanceModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success' });
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStudentsLoading(true);
    instance.get("/student")
      .then(res => {
        setStudents(res.data.data || []);
      })
      .catch(() => {
        setStudents([]);
      })
      .finally(() => setStudentsLoading(false));
  }, [open]);

  const handleSubmit = async (values: FormValues) => {
    if (!values.student_id || !values.date || !values.status) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await createAttendance({
        student_id: getEntityId(values.student_id) || values.student_id,
        status: values.status,
        date: values.date,
        lesson_id: '', // Agar lesson_id kerak bo‘lsa, formga qo‘shing yoki backendga moslang
      });
      setToast({ message: "Davomat qo'shildi!", type: 'success' });
      form.resetFields();
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err: any) {
      setToast({ message: err.message || "Qo'shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="Davomat qo'shish"
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <Form.Item
          name="student_id"
          label="Talaba"
          rules={[{ required: true, message: 'Talabani tanlang' }]}
        >
          {studentsLoading ? (
            <div style={{padding:'8px 0'}}><ClipLoader size={18} color="#009688" /></div>
          ) : (
            <Select disabled={loading || studentsLoading}>
              <Select.Option value="">Talabani tanlang</Select.Option>
              {students.map((student) => (
                <Select.Option key={student._id} value={student._id}>{student.fullName || student.name}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="date"
          label="Sana"
          rules={[{ required: true, message: 'Sanani tanlang' }]}
        >
          <Input type="date" disabled={loading} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Statusni tanlang' }]}
        >
          <Select disabled={loading}>
            <Select.Option value="present">Kelgan</Select.Option>
            <Select.Option value="absent">Kelmagan</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={studentsLoading}>
            Qo'shish
          </Button>
          <Button type="default" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAttendanceModal;

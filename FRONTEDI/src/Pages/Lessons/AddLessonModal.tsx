import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { Modal, Form, Input, Button, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./Lesson.css";

interface Group {
  group_id: string;
  name: string;
}

interface LessonForm {
  group_id: string;
  topic: string;
  lesson_date: string;
  recording_path: string;
}

interface ToastProps {
  message: string;
  type: string;
}

interface AddLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: '', type: 'success' });
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    // Guruhlarni olish
    instance.get('/groups').then(res => {
      let data = res.data.data || [];
      setGroups(data);
      console.log('Guruhlar:', data);
    });
  }, []);

  const handleSubmit = async (values: LessonForm) => {
    // Debug: Ko'rib chiqish uchun formani konsolga chiqaramiz
    console.log('Yuborilayotgan forma:', values);
    if (!values.group_id || !values.topic || !values.lesson_date || !values.recording_path) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...values,
        lesson_date: new Date(values.lesson_date).toISOString()
      };
      await instance.post("/lesson", payload);
      setToast({ message: "Dars qo'shildi!", type: 'success' });
      form.resetFields();
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || "Qo'shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="Dars qo'shish"
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item name="group_id">
          <Select>
            <Select.Option value="">Guruhni tanlang</Select.Option>
            {groups.map((g, idx) => (
              <Select.Option key={g.group_id || g._id || idx} value={g.group_id || g._id}>{g.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="topic">
          <Input placeholder="Mavzu" />
        </Form.Item>
        <Form.Item name="lesson_date">
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item name="recording_path">
          <Input placeholder="Yozuv yo‘li" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Qo'shish
        </Button>
        <Button type="default" onClick={onClose} disabled={loading}>
          Bekor qilish
        </Button>
      </Form>
    </Modal>
  );
};

export default AddLessonModal;

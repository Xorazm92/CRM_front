import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import 'antd/dist/reset.css';
import "./Assignments.css";

interface Group {
  group_id?: string;
  _id?: string;
  id?: string;
  name: string;
}

interface Lesson {
  lesson_id?: string;
  _id?: string;
  id?: string;
  topic: string;
  lesson_date?: string;
}

interface FormValues {
  title: string;
  description: string;
  group_id: string;
  lesson_id: string;
  due_date: Date | null;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAssignmentModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success' });
  const [groups, setGroups] = useState<Group[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    instance.get('/groups').then(res => {
      let data = res.data;
      if (Array.isArray(data)) {
        setGroups(data);
      } else if (Array.isArray(data.data)) {
        setGroups(data.data);
      } else if (Array.isArray(data.results)) {
        setGroups(data.results);
      } else {
        setGroups([]);
      }
    }).catch(() => setGroups([]));
  }, [open]);

  useEffect(() => {
    if (!form.getFieldValue('group_id')) {
      setLessons([]);
      form.setFieldsValue({ lesson_id: '' });
      return;
    }
    instance.get(`/lesson?group_id=${form.getFieldValue('group_id')}`).then(res => {
      let data = res.data;
      if (Array.isArray(data.data)) {
        setLessons(data.data);
      } else if (Array.isArray(data)) {
        setLessons(data);
      } else if (Array.isArray(data.results)) {
        setLessons(data.results);
      } else {
        setLessons([]);
      }
    });
  }, [form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  // DD.MM.YYYY format uchun yordamchi funksiya
  function formatDateDMY(date: Date | string | null): string {
    if (!date) return '';
    let d = (date instanceof Date) ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleSubmit = async (values: FormValues) => {
    if (!values.title || !values.due_date) {
      message.error("Nom va tugash sanasi majburiy!");
      return;
    }
    setLoading(true);
    let deadlineISO = '';
    if (values.due_date instanceof Date) {
      deadlineISO = values.due_date.toISOString();
    } else if (typeof values.due_date === 'string' && values.due_date.length > 0) {
      const d = new Date(values.due_date);
      deadlineISO = d.toISOString();
    } else {
      deadlineISO = '';
    }
    let groupId = undefined;
    let lessonId = undefined;
    if (values.group_id) {
      const g = groups.find(g => g.group_id === values.group_id || g._id === values.group_id || g.id === values.group_id);
      if (g) groupId = g.group_id || g._id || g.id;
    }
    if (values.lesson_id) {
      const l = lessons.find(l => l.lesson_id === values.lesson_id || l._id === values.lesson_id || l.id === values.lesson_id);
      if (l) lessonId = l.lesson_id || l._id || l.id;
    }
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('deadline', deadlineISO);
    if (values.description) formData.append('description', values.description);
    if (groupId) formData.append('group_id', groupId);
    if (lessonId) formData.append('lesson_id', lessonId);
    if (file) formData.append('file', file);
    try {
      await instance.post("/assignments", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success("Vazifa muvaffaqiyatli qo'shildi!");
      form.resetFields();
      setFile(null);
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      let uzMessage = "Qo'shishda xatolik";
      if (err.response && err.response.data && err.response.data.message) {
        let msg = err.response.data.message;
        if (msg && typeof msg === 'string' && msg.includes('ISO 8601')) {
          uzMessage = "Deadline (tugash sanasi) noto'g'ri formatda. Iltimos, sanani to'g'ri tanlang.";
        } else if (msg && typeof msg === 'string' && msg.includes('must be a UUID')) {
          uzMessage = "Dars yoki guruh ID'si noto'g'ri. Iltimos, tanlovlarni qayta tekshiring.";
        } else if (Array.isArray(msg)) {
          uzMessage = msg.map(m =>
            m.includes('ISO 8601') ? "Deadline (tugash sanasi) noto'g'ri formatda. Iltimos, sanani to'g'ri tanlang."
            : m.includes('must be a UUID') ? "Dars yoki guruh ID'si noto'g'ri. Iltimos, tanlovlarni qayta tekshiring."
            : m
          ).join(', ');
        } else {
          uzMessage = msg;
        }
        message.error(uzMessage);
      } else {
        message.error(uzMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="Vazifa qo'shish"
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Nomi"
          rules={[{ required: true, message: 'Nomni kiriting' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="group_id"
          label="Guruh"
          rules={[{ required: true, message: 'Guruhni tanlang' }]}
        >
          <Select>
            <Select.Option value="">Tanlang</Select.Option>
            {groups.map((g) => (
              <Select.Option key={g.group_id || g._id || g.id} value={g.group_id || g._id || g.id}>{g.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="lesson_id"
          label="Dars"
          rules={[{ required: true, message: 'Darsni tanlang' }]}
        >
          <Select disabled={!form.getFieldValue('group_id')}>
            <Select.Option value="">Tanlang</Select.Option>
            {lessons.map((l) => (
              <Select.Option key={l.lesson_id || l._id || l.id} value={l.lesson_id || l._id || l.id}>
                {l.topic} ({l.lesson_date ? formatDateDMY(l.lesson_date) : ''})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Tavsif"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="due_date"
          label="Tugash sanasi"
          rules={[{ required: true, message: 'Tugash sanasini tanlang' }]}
        >
          <DatePicker
            format="DD.MM.YYYY"
            placeholder="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Fayl biriktirish"
        >
          <Input type="file" onChange={handleFileChange} />
          {file && <span style={{fontSize:'12px', color:'#555'}}>Tanlangan fayl: {file.name}</span>}
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

export default AddAssignmentModal;

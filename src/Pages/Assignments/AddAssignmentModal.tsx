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
  group_id?: string;
  group?: {
    _id?: string;
    id?: string;
  };
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

  const fetchLessons = (groupId: string) => {
    if (!groupId) {
      setLessons([]);
      form.setFieldsValue({ lesson_id: '' });
      return;
    }
    instance.get(`/lesson?group_id=${groupId}`).then(res => {
      let data = res.data;
      let filtered = [];
      if (Array.isArray(data.data)) {
        filtered = data.data.filter((l: any) => l.group_id === groupId || l.group?._id === groupId || l.group?.id === groupId);
      } else if (Array.isArray(data)) {
        filtered = data.filter((l: any) => l.group_id === groupId || l.group?._id === groupId || l.group?.id === groupId);
      } else if (Array.isArray(data.results)) {
        filtered = data.results.filter((l: any) => l.group_id === groupId || l.group?._id === groupId || l.group?.id === groupId);
      }
      setLessons(filtered);
    });
  };

  useEffect(() => {
    const groupId = form.getFieldValue('group_id');
    fetchLessons(groupId);
  }, [form.getFieldValue('group_id')]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  function formatDateDMY(date: Date | string | null): string {
    if (!date) return '';
    let d = (date instanceof Date) ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleSubmit = async (values: FormValues) => {
    // Debug: due_date qiymatini ham ko'rsatish
    console.log('values.due_date:', values.due_date);
    let deadlineISO = '';
    if (values.due_date && typeof values.due_date === 'object' && typeof values.due_date.toISOString === 'function') {
      deadlineISO = values.due_date.toISOString();
    } else if (typeof values.due_date === 'string' && values.due_date.length > 0) {
      const d = new Date(values.due_date);
      if (!isNaN(d.getTime())) {
        deadlineISO = d.toISOString();
      } else {
        deadlineISO = '';
      }
    } else {
      deadlineISO = '';
    }

    const groupId = values.group_id;
    const lessonId = values.lesson_id;

    // Debug: qiymatlarni ko'rsatish
    console.log({
      title: values.title,
      description: values.description,
      group_id: groupId,
      lesson_id: lessonId,
      deadline: deadlineISO
    });

    if (
      !values.title ||
      typeof values.title !== 'string' ||
      !values.description ||
      typeof values.description !== 'string' ||
      !groupId ||
      !lessonId ||
      !deadlineISO
    ) {
      message.error('Barcha maydonlarni to‘g‘ri to‘ldiring!');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('deadline', deadlineISO);
        formData.append('group_id', groupId);
        formData.append('lesson_id', lessonId);
        formData.append('file', file);
        await instance.post("/assignments", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const payload = {
          title: values.title,
          description: values.description,
          deadline: deadlineISO,
          group_id: groupId,
          lesson_id: lessonId
        };
        await instance.post("/assignments", payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      message.success("Vazifa muvaffaqiyatli qo'shildi!");
      form.resetFields();
      setFile(null);
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      let uzMessage = "Qo'shishda xatolik";
      if (err && typeof err === 'object' && 'response' in err && err.response && err.response.data && err.response.data.message) {
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
          label="Vazifa nomi"
          rules={[{ required: true, message: 'Vazifa nomini kiriting' }]}
        >
          <Input placeholder="Vazifa nomi" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Tavsif"
          rules={[{ required: true, message: 'Tavsifni kiriting' }]}
        >
          <Input.TextArea placeholder="Tavsif" />
        </Form.Item>
        <Form.Item
          name="group_id"
          label="Guruh"
          rules={[{ required: true, message: 'Guruhni tanlang' }]}
        >
          <Select
            showSearch
            placeholder="Guruhni tanlang"
            options={groups.map(g => ({ label: g.name, value: g.group_id || g._id || g.id }))}
            onChange={value => {
              form.setFieldsValue({ group_id: value, lesson_id: undefined });
              fetchLessons(value); // Guruh tanlanganda darslarni olib kelish
            }}
          />
        </Form.Item>
        <Form.Item
          name="lesson_id"
          label="Dars"
          rules={[{ required: true, message: 'Darsni tanlang' }]}
        >
          <Select
            showSearch
            placeholder="Darsni tanlang"
            options={lessons.map(l => ({ label: l.topic, value: l.lesson_id || l._id || l.id }))}
            disabled={!form.getFieldValue('group_id')}
          />
        </Form.Item>
        <Form.Item
          name="due_date"
          label="Tugash sanasi"
          rules={[{ required: true, message: 'Tugash sanasini tanlang' }]}
        >
          <DatePicker
            showTime
            style={{ width: '100%' }}
            placeholder="Tugash sanasini tanlang"
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

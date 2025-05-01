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
    if (values.due_date) {
      // dayjs obyektini ham, Date ni ham, stringni ham to'g'ri ishlash
      if (typeof values.due_date === 'object' && typeof values.due_date.toDate === 'function') {
        // dayjs
        deadlineISO = values.due_date.toDate().toISOString();
      } else if (typeof values.due_date === 'object' && typeof values.due_date.toISOString === 'function') {
        // Date
        deadlineISO = values.due_date.toISOString();
      } else if (typeof values.due_date === 'string' && values.due_date.length > 0) {
        const d = new Date(values.due_date);
        if (!isNaN(d.getTime())) {
          deadlineISO = d.toISOString();
        }
      }
    }

    // To'g'ri formatlangan payload tuzamiz
    const payload = {
      title: values.title ? String(values.title) : '',
      description: values.description ? String(values.description) : '',
      group_id: values.group_id ? String(values.group_id) : '',
      lesson_id: values.lesson_id ? String(values.lesson_id) : '',
      deadline: deadlineISO
    };

    // Debug uchun payloadni ko'rsatamiz
    console.log('Yuborilayotgan payload:', payload);

    if (
      !payload.title ||
      typeof payload.title !== 'string' ||
      !payload.description ||
      typeof payload.description !== 'string' ||
      !payload.group_id ||
      !payload.lesson_id ||
      !payload.deadline
    ) {
      message.error('Barcha maydonlarni to‘g‘ri to‘ldiring!');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Extra: log typeof and value for group_id and lesson_id
      console.log('Submit group_id:', payload.group_id, typeof payload.group_id);
      console.log('Submit lesson_id:', payload.lesson_id, typeof payload.lesson_id);
      // Extra: UUID validation (simple regex)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(String(payload.group_id)) || !uuidRegex.test(String(payload.lesson_id))) {
        message.error('Guruh yoki dars ID noto‘g‘ri. Iltimos, tanlovlarni qayta tanlang.');
        setLoading(false);
        return;
      }
      if (file) {
        const formData = new FormData();
        formData.append('title', String(payload.title ?? ''));
        formData.append('description', String(payload.description ?? ''));
        formData.append('deadline', String(payload.deadline ?? ''));
        formData.append('group_id', String(payload.group_id ?? ''));
        formData.append('lesson_id', String(payload.lesson_id ?? ''));
        if (file) formData.append('file', file);
        // Debug: log FormData values
        // @ts-ignore
        for (let [k, v] of (formData as any).entries()) {
          console.log('FormData', k, v);
        }
        await instance.post("/assignments", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await instance.post("/assignments", payload, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      message.success("Vazifa muvaffiyatli qo'shildi!");
      form.resetFields();
      setFile(null);
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err: any) {
      let uzMessage = "Qo'shishda xatolik";
      if (err?.response?.data?.message) {
        let msg = err.response.data.message;
        if (typeof msg === 'string') {
          uzMessage = msg;
        } else if (Array.isArray(msg)) {
          uzMessage = msg.join(', ');
        }
      }
      message.error(uzMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="Vazifa qo'shish"
      open={open}
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
            options={groups
              .map(g => {
                const id = g.group_id || g._id || g.id;
                return id && typeof id === 'string' ? { label: g.name, value: id } : null;
              })
              .filter(Boolean) as { label: string; value: string }[]}
            onChange={value => {
              console.log('Selected group_id:', value, typeof value);
              form.setFieldsValue({ group_id: value, lesson_id: undefined });
              fetchLessons(value);
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
            options={lessons
              .map(l => {
                const id = l.lesson_id || l._id || l.id;
                return id && typeof id === 'string' ? { label: l.topic, value: id } : null;
              })
              .filter(Boolean) as { label: string; value: string }[]}
            disabled={!form.getFieldValue('group_id')}
            onChange={value => {
              console.log('Selected lesson_id:', value, typeof value);
              form.setFieldsValue({ lesson_id: value });
            }}
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
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="default" onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAssignmentModal;

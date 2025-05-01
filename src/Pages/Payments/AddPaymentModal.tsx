import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber } from "antd";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import { getEntityId } from "../../utils/getEntityId";
import dayjs from "dayjs";

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  student_id: string;
  date: string;
  amount: string;
  status: string;
  payment_type: string;
}

interface ToastType {
  message: string;
  type: 'success' | 'error' | undefined;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastType>({ message: '', type: undefined });
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open]);

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await instance.get("/users?role=STUDENT");
      setStudents(res.data.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setToast({ message: err.message, type: 'error' });
      } else {
        setToast({ message: 'Unknown error', type: 'error' });
      }
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleSubmit = async (values: FormState) => {
    if (!values.student_id || !values.date || !values.amount || !values.status || !values.payment_type) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/payments/student", {
        ...values,
        type: values.payment_type, // map payment_type to type
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
        amount: Number(values.amount),
        student_id: getEntityId(values.student_id) || values.student_id
      });
      setToast({ message: "To‘lov qo‘shildi!", type: 'success' });
      form.resetFields();
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setToast({ message: err.message, type: 'error' });
      } else {
        setToast({ message: 'Unknown error', type: 'error' });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: undefined }), 2000);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="To‘lov qo‘shish"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: undefined })} />
        <Form.Item name="student_id" label="Talaba" rules={[{ required: true, message: "Talabani tanlang!" }]}> 
          <Select
            showSearch
            placeholder="Talaba tanlang"
            optionFilterProp="children"
            loading={studentsLoading}
            disabled={loading}
            filterOption={(input, option) => typeof option?.children === 'string' && option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {students.map((s) => (
              <Select.Option key={getEntityId(s)} value={getEntityId(s)}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Sana" rules={[{ required: true, message: "Sanani tanlang!" }]}> 
          <DatePicker className="w-full" disabled={loading} format="YYYY-MM-DD" /> 
        </Form.Item>
        <Form.Item name="amount" label="Summasi" rules={[{ required: true, message: "Summani kiriting!" }]}> 
          <InputNumber className="w-full" disabled={loading} min={0} /> 
        </Form.Item>
        <Form.Item name="payment_type" label="To‘lov turi" rules={[{ required: true, message: "To‘lov turini tanlang!" }]}> 
          <Select placeholder="To‘lov turini tanlang" disabled={loading}>
            <Select.Option value="MONTHLY">Oylik</Select.Option>
            <Select.Option value="COURSE">Kurs uchun</Select.Option>
            <Select.Option value="OTHER">Boshqa</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: "Statusni tanlang!" }]}> 
          <Select disabled={loading}>
            <Select.Option value="pending">Kutilmoqda</Select.Option>
            <Select.Option value="paid">To‘langan</Select.Option>
            <Select.Option value="canceled">Bekor qilingan</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="primary" htmlType="submit" loading={loading}>Qo‘shish</Button>
          <Button type="default" onClick={onClose} disabled={loading}>Bekor qilish</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPaymentModal;

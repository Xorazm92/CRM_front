import React, { useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import ClipLoader from "react-spinners/ClipLoader";
import "./Payments.css";

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
}

interface ToastState {
  message: string;
  type: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success' });

  const handleSubmit = async (values: FormState) => {
    if (!values.student_id || !values.date || !values.amount || !values.status) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await instance.post("/payments/student", values);
      setToast({ message: "To‘lov qo‘shildi!", type: 'success' });
      form.resetFields();
      onSuccess && onSuccess();
      setTimeout(onClose, 1000);
    } catch (err) {
      setToast({ message: err.message || "Qo‘shishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast({ message: '', type: 'success' }), 2000);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="To‘lov qo‘shish"
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <Form.Item name="student_id" label="Talaba ID">
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item name="date" label="Sana">
          <Input type="date" disabled={loading} />
        </Form.Item>
        <Form.Item name="amount" label="Summasi">
          <Input type="number" disabled={loading} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select disabled={loading}>
            <Select.Option value="pending">Kutilmoqda</Select.Option>
            <Select.Option value="paid">To‘langan</Select.Option>
            <Select.Option value="canceled">Bekor qilingan</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Qo‘shish</Button>
        <Button type="default" onClick={onClose} disabled={loading}>Bekor qilish</Button>
      </Form>
    </Modal>
  );
};

export default AddPaymentModal;

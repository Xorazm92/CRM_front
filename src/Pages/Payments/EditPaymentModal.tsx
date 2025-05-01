// Converted from EditPaymentModal.jsx to EditPaymentModal.tsx with TypeScript, Ant Design, and backend naming conventions
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message, Spin, InputNumber } from "antd";
import { updateStudentPayment } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";
import dayjs from "dayjs";

interface EditPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  payment: any;
}

interface EditPaymentForm {
  student_id: string;
  date: any;
  amount: number | string;
  status: string;
  payment_type: string;
}

interface ToastType {
  message: string;
  type: 'success' | 'error' | undefined;
}

interface PaymentStatus {
  value: string;
  label: string;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ open, onClose, onSuccess, payment }) => {
  const [form] = Form.useForm<EditPaymentForm>();
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = useState<ToastType>({ message: '', type: undefined });

  useEffect(() => {
    if (payment && open) {
      form.setFieldsValue({
        student_id: getEntityId(payment.student || { student_id: payment.student_id, id: payment.studentId, _id: payment.student?._id }) || '',
        date: payment.date ? payment.date : undefined,
        amount: payment.amount,
        status: payment.status,
        payment_type: payment.payment_type
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [payment, open, form]);

  const handleFinish = async (values: EditPaymentForm) => {
    if (!values.student_id || !values.date || !values.amount || !values.status || !values.payment_type) {
      setToast({ message: "Barcha maydonlarni to'ldiring", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await updateStudentPayment(payment.id, {
        student_id: getEntityId(values.student_id) || values.student_id, // always send student_id
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
        amount: Number(values.amount),
        status: values.status,
        payment_type: values.payment_type
      });
      setToast({ message: "To‘lov tahrirlandi!", type: 'success' });
      onSuccess && onSuccess();
      setTimeout(onClose, 800);
    } catch (err: any) {
      if (err instanceof Error) {
        setToast({ message: err.message, type: 'error' });
      } else {
        setToast({ message: 'Unknown error', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="To‘lovni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item name="student_id" label="Talaba ID" rules={[{ required: true, message: "Talaba ID majburiy!" }]}> 
            <Input disabled={loading} /> 
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
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> 
            <Select disabled={loading} options={[
              { value: 'pending', label: 'Kutilmoqda' },
              { value: 'paid', label: 'To‘langan' },
              { value: 'canceled', label: 'Bekor qilingan' },
            ]} /> 
          </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditPaymentModal;

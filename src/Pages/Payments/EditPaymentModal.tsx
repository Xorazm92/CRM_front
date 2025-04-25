// Converted from EditPaymentModal.jsx to EditPaymentModal.tsx with TypeScript, Ant Design, and backend naming conventions
import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message, Spin } from "antd";
import { updateStudentPayment } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";

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
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ open, onClose, onSuccess, payment }) => {
  const [form] = Form.useForm<EditPaymentForm>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (payment && open) {
      form.setFieldsValue({
        student_id: getEntityId(payment.student || { student_id: payment.student_id, id: payment.studentId, _id: payment.student?._id }) || '',
        date: payment.date ? payment.date : undefined,
        amount: payment.amount,
        status: payment.status
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [payment, open, form]);

  const handleFinish = async (values: EditPaymentForm) => {
    if (!values.student_id || !values.date || !values.amount || !values.status) {
      message.error("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    try {
      await updateStudentPayment(payment.id, {
        student_id: getEntityId(values.student_id) || values.student_id, // always send student_id
        date: typeof values.date === 'string' ? values.date : values.date?.format("YYYY-MM-DD"),
        amount: Number(values.amount),
        status: values.status
      });
      message.success("To‘lov tahrirlandi!");
      onSuccess && onSuccess();
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="To‘lovni tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="student_id" label="Talaba ID" rules={[{ required: true, message: "Talaba ID majburiy!" }]}> <Input disabled={loading} /> </Form.Item>
          <Form.Item name="date" label="Sana" rules={[{ required: true, message: "Sana majburiy!" }]}> <DatePicker className="w-full" disabled={loading} /> </Form.Item>
          <Form.Item name="amount" label="Summasi" rules={[{ required: true, message: "Summani kiriting!" }]}> <Input type="number" disabled={loading} /> </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Status majburiy!" }]}> <Select disabled={loading} options={[
            { value: 'pending', label: 'Kutilmoqda' },
            { value: 'paid', label: 'To‘langan' },
            { value: 'canceled', label: 'Bekor qilingan' }
          ]} /> </Form.Item>
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

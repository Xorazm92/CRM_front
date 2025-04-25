// Converted from AddStudentPaymentModal.jsx to AddStudentPaymentModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { createStudentPayment } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";

interface AddStudentPaymentModalProps {
  studentId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddStudentPaymentForm {
  amount: number | string;
  payment_type: string;
  description?: string;
}

const AddStudentPaymentModal: React.FC<AddStudentPaymentModalProps> = ({ studentId, open, onClose, onSuccess }) => {
  const [form] = Form.useForm<AddStudentPaymentForm>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: AddStudentPaymentForm) => {
    setLoading(true);
    try {
      await createStudentPayment({
        student_id: getEntityId(studentId) || studentId, // always send student_id
        amount: Number(values.amount),
        type: values.payment_type as any, // PaymentType enum yoki string
      });
      message.success("To‘lov muvaffaqiyatli amalga oshirildi!");
      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.message || "To‘lovni amalga oshirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="To‘lov qilish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="amount" label="To‘lov summasi" rules={[{ required: true, message: "Summani kiriting!" }]}> <Input type="number" disabled={loading} /> </Form.Item>
          <Form.Item name="payment_type" label="To‘lov turi" initialValue="naqd" rules={[{ required: true, message: "To‘lov turini tanlang!" }]}> <Select disabled={loading} options={[
            { value: "naqd", label: "Naqd" },
            { value: "karta", label: "Karta" },
            { value: "onlayn", label: "Onlayn" }
          ]} /> </Form.Item>
          <Form.Item name="description" label="Izoh"> <Input disabled={loading} /> </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>To‘lov qilish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddStudentPaymentModal;

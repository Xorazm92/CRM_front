// Converted from AddTeacherSalaryModal.jsx to AddTeacherSalaryModal.tsx with TypeScript, Ant Design, and professional UX
import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Spin } from "antd";

interface AddTeacherSalaryModalProps {
  teacherId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddTeacherSalaryForm {
  amount: number | string;
  description?: string;
}

const AddTeacherSalaryModal: React.FC<AddTeacherSalaryModalProps> = ({ teacherId, open, onClose, onSuccess }) => {
  const [form] = Form.useForm<AddTeacherSalaryForm>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: AddTeacherSalaryForm) => {
    setLoading(true);
    try {
      const res = await fetch("/payment/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId, // backend expects teacher_id
          amount: Number(values.amount),
          description: values.description,
        }),
      });
      if (!res.ok) throw new Error("Oylikni amalga oshirishda xatolik");
      message.success("Oylik muvaffaqiyatli hisoblandi!");
      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Oylik hisoblash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="amount" label="Oylik summasi" rules={[{ required: true, message: "Summani kiriting!" }]}> <Input type="number" disabled={loading} /> </Form.Item>
          <Form.Item name="description" label="Izoh"> <Input disabled={loading} /> </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Oylik hisoblash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddTeacherSalaryModal;

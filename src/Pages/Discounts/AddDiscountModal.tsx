import React, { useState } from "react";
import { Modal, Form, Input, Button, InputNumber, DatePicker, message } from "antd";
import instance from "../../api/axios";

interface AddDiscountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await instance.post("/discounts", {
        student_id: values.student_id,
        percent: values.percent,
        description: values.description,
        valid_from: values.valid_from.format("YYYY-MM-DD"),
        valid_to: values.valid_to.format("YYYY-MM-DD"),
      });
      message.success("Chegirma muvaffaqiyatli qo'shildi!");
      onClose();
      form.resetFields();
      onSuccess && onSuccess();
    } catch (err: any) {
      message.error(err.message || "Chegirma qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Chegirma qo'shish" destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="student_id" label="O'quvchi ID" rules={[{ required: true, message: "O'quvchi ID majburiy" }]}> 
          <Input placeholder="Talaba user_id yoki ism familiya" />
        </Form.Item>
        <Form.Item name="percent" label="Chegirma foizi (%)" rules={[{ required: true, message: "Foiz majburiy" }]}> 
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label="Izoh"> 
          <Input.TextArea rows={2} placeholder="Izoh (ixtiyoriy)" />
        </Form.Item>
        <Form.Item name="valid_from" label="Boshlanish sanasi" rules={[{ required: true, message: "Boshlanish sanasi majburiy" }]}> 
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="valid_to" label="Tugash sanasi" rules={[{ required: true, message: "Tugash sanasi majburiy" }]}> 
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDiscountModal;

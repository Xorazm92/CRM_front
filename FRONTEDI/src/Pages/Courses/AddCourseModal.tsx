// Converted from AddCourseModal.jsx to AddCourseModal.tsx with TypeScript, Ant Design, and professional UX
import React from "react";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import instance from "../../api/axios";

interface AddCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
interface AddCourseForm {
  name: string;
  description: string;
  duration: number;
  status: string;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm<AddCourseForm>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleFinish = async (values: AddCourseForm) => {
    setLoading(true);
    try {
      await instance.post("/course", values);
      message.success("Kurs qo'shildi!");
      form.resetFields();
      onSuccess && onSuccess();
      setTimeout(onClose, 800);
    } catch (err: any) {
      message.error(err.message || "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Kurs qo'shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Kurs nomi" rules={[{ required: true, message: "Kurs nomi majburiy!" }]}> <Input placeholder="Kurs nomi" disabled={loading} /> </Form.Item>
          <Form.Item name="description" label="Izoh" rules={[{ required: true, message: "Izoh majburiy!" }]}> <Input placeholder="Izoh" disabled={loading} /> </Form.Item>
          <Form.Item name="duration" label="Davomiyligi (oy)" rules={[{ required: true, message: "Davomiylik majburiy!" }]}> <Input type="number" min={1} placeholder="Davomiyligi (oy)" disabled={loading} /> </Form.Item>
          <Form.Item name="status" label="Status" initialValue="ACTIVE" rules={[{ required: true, message: "Status majburiy!" }]}> <Select disabled={loading}> <Select.Option value="ACTIVE">Faol</Select.Option> <Select.Option value="INACTIVE">Nofaol</Select.Option> </Select> </Form.Item>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo'shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddCourseModal;

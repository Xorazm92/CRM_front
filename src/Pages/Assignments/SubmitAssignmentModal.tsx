import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../api/axios";
import { useState } from "react";

interface SubmitAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ open, onClose, assignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignment_id", assignment.assignment_id || assignment.id);
      if (values.answer_text) formData.append("answer_text", values.answer_text);
      if (values.file && values.file.file) formData.append("file", values.file.file.originFileObj);
      await instance.post("/submissions", formData, { headers: { "Content-Type": "multipart/form-data" } });
      message.success("Topshiriq muvaffaqiyatli yuborildi");
      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch {
      message.error("Yuborishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !assignment) return null;

  return (
    <Modal open={open} onCancel={onClose} title="Topshiriqni topshirish" footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="answer_text" label="Javob matni">
          <Input.TextArea rows={3} placeholder="Javobingizni kiriting yoki fayl yuklang" />
        </Form.Item>
        <Form.Item name="file" label="Fayl">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Yuborish</Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>Bekor qilish</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubmitAssignmentModal;

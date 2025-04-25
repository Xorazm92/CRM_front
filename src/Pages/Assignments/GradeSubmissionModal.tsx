import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Spin } from "antd";
import instance from "../../api/axios";

interface GradeSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  submission: any;
  onSuccess: () => void;
}

const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({ open, onClose, submission, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submission && open) {
      form.setFieldsValue({
        grade: submission.grade || '',
        feedback: submission.feedback || ''
      });
    }
  }, [submission, open, form]);

  if (!open || !submission) return null;

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await instance.patch(`/submissions/${submission.submission_id || submission.id}`,
        {
          grade: values.grade,
          feedback: values.feedback
        }
      );
      message.success("Baholash saqlandi!");
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error("Baholashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Baholash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="grade" label="Baho" rules={[{ required: true, message: "Baho majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="feedback" label="Feedback"> <Input.TextArea rows={3} /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default GradeSubmissionModal;

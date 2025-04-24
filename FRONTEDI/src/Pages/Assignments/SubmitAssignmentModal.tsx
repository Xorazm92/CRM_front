import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../api/axios";

interface SubmitAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ open, onClose, assignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

  if (!open || !assignment) return null;

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignment_id", assignment.assignment_id || assignment.id);
      formData.append("answer_text", values.answer_text || "");
      if (fileList.length > 0) formData.append("file", fileList[0].originFileObj);
      await instance.post("/submissions", formData);
      message.success("Vazifa topshirildi!");
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error("Topshirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Vazifani topshirish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="answer_text" label="Javob matni"> <Input.TextArea rows={4} placeholder="Javob matni..." /> </Form.Item>
          <Form.Item label="Fayl biriktirish">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Fayl tanlash</Button>
            </Upload>
            {fileList.length > 0 && <span className="text-xs text-gray-500">Tanlangan fayl: {fileList[0].name}</span>}
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Topshirish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default SubmitAssignmentModal;

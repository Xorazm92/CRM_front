import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, Spin, message } from "antd";
import instance from "../../api/axios";

interface AddStudentToGroupModalProps {
  groupId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudentToGroupModal: React.FC<AddStudentToGroupModalProps> = ({ groupId, open, onClose, onSuccess }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    instance.get("/users?role=STUDENT").then(res => {
      let arr = Array.isArray(res.data) ? res.data : res.data.data || res.data.results || [];
      setStudents(arr);
    }).catch(() => {
      message.error("Talabalarni yuklashda xatolik");
      setStudents([]);
    }).finally(() => setLoading(false));
  }, [open]);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await instance.post('/admin/addMembersToGroup', {
        group_id: groupId,
        user_ids: Array.isArray(values.student_ids) ? values.student_ids : [values.student_ids]
      });
      message.success("Talaba guruhga muvaffaqiyatli qo'shildi!");
      onSuccess();
      form.resetFields();
    } catch (err: any) {
      console.log('BACKEND ERROR:', err?.response?.data);
      message.error(err?.response?.data?.message || "Qo'shishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      title="Guruhga talaba qo'shish"
      confirmLoading={submitting}
      destroyOnClose
    >
      {loading ? <Spin /> : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="student_ids"
            label="Talabalarni tanlang"
            rules={[{ required: true, message: "Kamida 1 ta talaba tanlang!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Talabalarni tanlang"
              options={students.map(s => ({ value: s.user_id || s._id || s.id, label: s.full_name || s.name }))}
              showSearch
              filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddStudentToGroupModal;

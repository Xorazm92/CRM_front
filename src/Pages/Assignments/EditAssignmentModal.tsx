import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../api/axios";

interface EditAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignment: any;
}

const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({ open, onClose, onSuccess, assignment }) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    instance.get('/groups').then(res => {
      let data = res.data;
      if (Array.isArray(data)) setGroups(data);
      else if (Array.isArray(data.data)) setGroups(data.data);
      else if (Array.isArray(data.results)) setGroups(data.results);
      else setGroups([]);
    }).finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (assignment && open) {
      form.setFieldsValue({
        title: assignment.title || '',
        description: assignment.description || '',
        group_id: assignment.group_id || assignment.group?.group_id || assignment.group?._id || assignment.group?.id || '',
        due_date: assignment.due_date ? assignment.due_date : undefined
      });
    }
  }, [assignment, open, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await instance.put(`/assignments/${assignment.assignment_id || assignment.id}`,
        {
          title: values.title,
          description: values.description,
          group_id: values.group_id,
          due_date: values.due_date ? (typeof values.due_date === 'string' ? values.due_date : values.due_date.toISOString()) : undefined
        }
      );
      message.success("Vazifa tahrirlandi!");
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Vazifani tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Nomi" rules={[{ required: true, message: "Nom majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh majburiy!" }]}> <Select placeholder="Guruh tanlang" options={groups.map(g => ({ value: g.group_id || g._id || g.id, label: g.name }))} /> </Form.Item>
          <Form.Item name="description" label="Tavsif"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="due_date" label="Tugash sanasi" rules={[{ required: true, message: "Tugash sanasi majburiy!" }]}> <DatePicker className="w-full" /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditAssignmentModal;

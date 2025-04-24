import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import instance from "../../../api/axios";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onStudentAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    instance.get('/groups').then(res => {
      let data = res.data;
      if (Array.isArray(data)) setGroups(data);
      else if (Array.isArray(data.data)) setGroups(data.data);
      else if (Array.isArray(data.results)) setGroups(data.results);
      else setGroups([]);
    }).finally(() => setLoading(false));
  }, [isOpen]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await instance.post("/student", {
        name: values.name,
        birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
        gender: values.gender,
        group_id: values.group_id
      });
      message.success("O‘quvchi muvaffaqiyatli qo‘shildi!");
      form.resetFields();
      onStudentAdded();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O‘quvchi qo‘shish" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="F.I.Sh." rules={[{ required: true, message: "Ism majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="birthDate" label="Tug‘ilgan sana"> <DatePicker className="w-full" /> </Form.Item>
          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsi tanlang" options={[{ value: 'male', label: 'Erkak' }, { value: 'female', label: 'Ayol' }]} /> </Form.Item>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh majburiy!" }]}> <Select placeholder="Guruh tanlang" options={groups.map(g => ({ value: g.group_id || g._id || g.id, label: g.name }))} /> </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Qo‘shish</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddStudentModal;

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import { updateStudent } from "../../../api/users";
import instance from "../../../api/axios";
import "./EditStudentModal.css";

interface GroupType {
  group_id?: string;
  _id?: string;
  id?: string;
  name?: string;
}

interface StudentType {
  user_id?: string;
  id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  phone_number?: string;
  group_id?: string;
  group?: GroupType;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentType;
  onStudentEdited: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onStudentEdited }) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    instance.get('/groups').then(res => {
      const data = res.data;
      if (Array.isArray(data)) setGroups(data);
      else if (Array.isArray(data.data)) setGroups(data.data);
      else if (Array.isArray(data.results)) setGroups(data.results);
      else setGroups([]);
    }).finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (student && isOpen) {
      form.setFieldsValue({
        name: student.name || '',
        lastname: student.lastname || '',
        middlename: student.middlename || '',
        birthDate: student.birthDate ? student.birthDate : undefined,
        gender: student.gender || '',
        address: student.address || '',
        phone_number: student.phone_number || '',
        group_id: student.group_id || student.group?.group_id || student.group?._id || student.group?.id || ''
      });
    }
  }, [student, isOpen, form]);

  const handleFinish = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      await updateStudent(student.user_id || student.id, {
        name: values.name,
        lastname: values.lastname,
        middlename: values.middlename,
        birthdate: values.birthDate ? (typeof values.birthDate === 'string' ? values.birthDate : values.birthDate.toISOString()) : undefined,
        gender: values.gender,
        address: values.address,
        phone_number: values.phone_number,
        group_id: values.group_id
      });
      message.success("O‘quvchi muvaffaqiyatli tahrirlandi!");
      onStudentEdited();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O‘quvchini tahrirlash" destroyOnClose>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy!" }]}> <Input /> </Form.Item>
          <Form.Item name="middlename" label="Otasining ismi"> <Input /> </Form.Item>
          <Form.Item name="birthDate" label="Tug‘ilgan sana"> <DatePicker className="edit-student-modal-datepicker" /> </Form.Item>
          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsi tanlang" options={[{ value: 'male', label: 'Erkak' }, { value: 'female', label: 'Ayol' }]} /> </Form.Item>
          <Form.Item name="address" label="Manzil"> <Input /> </Form.Item>
          <Form.Item name="phone_number" label="Telefon raqam"> <Input /> </Form.Item>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh majburiy!" }]}> <Select placeholder="Guruh tanlang" options={groups.map(g => ({ value: g.group_id || g._id || g.id, label: g.name }))} /> </Form.Item>
          <div className="edit-student-modal-footer">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditStudentModal;

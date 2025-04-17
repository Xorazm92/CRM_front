// {{ ... }}
// This file is deprecated. Please use admin/index.tsx for admin users page.
// {{ ... }}

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { userService } from '../services/users';

const { Option } = Select;

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      message.error('Foydalanuvchilarni olishda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Foydalanuvchi o‘chirildi!');
      fetchUsers();
    } catch {
      message.error('O‘chirishda xatolik!');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userService.update(editingUser.id, values);
        message.success('Foydalanuvchi yangilandi!');
      } else {
        await userService.create(values);
        message.success('Foydalanuvchi qo‘shildi!');
      }
      setModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch {}
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const columns = [
    { title: 'F.I.Sh.', dataIndex: 'full_name' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Role', dataIndex: 'role' },
    {
      title: 'Amallar',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Tahrirlash</Button>
          <Popconfirm title="O‘chirishni tasdiqlaysizmi?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>O‘chirish</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setModalOpen(true); setEditingUser(null); form.resetFields(); }} style={{ marginBottom: 16 }}>
        Foydalanuvchi qo‘shish
      </Button>
      <Table columns={columns} dataSource={users} loading={loading} rowKey="id" bordered />
      <Modal
        title={editingUser ? 'Foydalanuvchini tahrirlash' : 'Foydalanuvchi qo‘shish'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="full_name" label="F.I.Sh." rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}> <Input /> </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Parol" rules={[{ required: true, min: 6 }]}> <Input.Password /> </Form.Item>
          )}
          <Form.Item name="role" label="Rol" rules={[{ required: true }]}> 
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;

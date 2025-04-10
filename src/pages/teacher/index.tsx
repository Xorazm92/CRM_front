
import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teacher');
      const data = await response.json();
      setTeachers(data.data);
    } catch (error) {
      message.error('Failed to fetch teachers');
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.user_id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/teacher/${id}`, { method: 'DELETE' });
      message.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      message.error('Failed to delete teacher');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const method = form.getFieldValue('user_id') ? 'PATCH' : 'POST';
      const url = form.getFieldValue('user_id') 
        ? `/api/teacher/${form.getFieldValue('user_id')}` 
        : '/api/teacher/createTeacher';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      message.success(`Teacher ${method === 'POST' ? 'created' : 'updated'} successfully`);
      setIsModalVisible(false);
      form.resetFields();
      fetchTeachers();
    } catch (error) {
      message.error(`Failed to ${form.getFieldValue('user_id') ? 'update' : 'create'} teacher`);
    }
  };

  return (
    <div>
      <h2>Teacher Management</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add New Teacher
      </Button>
      <Table columns={columns} dataSource={teachers} rowKey="user_id" />
      
      <Modal
        title="Add/Edit Teacher"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          {!form.getFieldValue('user_id') && (
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;

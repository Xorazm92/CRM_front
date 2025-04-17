// {{ ... }}
// This page is deprecated. Please use students/index.tsx for students list or students/profile/[id].tsx for profile.
// {{ ... }}

import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/student');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      message.error('Failed to fetch students');
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Group',
      dataIndex: ['group', 'name'],
      key: 'group',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: { id: any; }) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: any) => {
    try {
      await fetch(`/api/student/${id}`, { method: 'DELETE' });
      message.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      message.error('Failed to delete student');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await fetch('/api/student/createStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Student created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      message.error('Failed to create student');
    }
  };

  return (
    <div>
      <h2>Student Management</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add New Student
      </Button>
      <Table columns={columns} dataSource={students} rowKey="id" />
      
      <Modal
        title="Add/Edit Student"
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
            name="phone"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
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

export default Students;

import  { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      console.log('Fetching admins...');
      const response = await fetch('http://localhost:3000/api/v1/admin');
      console.log(response);
      
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.log(error);
      message.error('Failed to fetch admins');
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
      render: (_: any, record: { id: any; }) => (
        <Space>
          <Button type="link">Tahrirlash</Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: any) => {
    try {
      await fetch(`/api/admin/${id}`, { method: 'DELETE' });
      message.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      message.error('Failed to delete admin');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await fetch('/api/admin/createAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Admin created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchAdmins();
    } catch (error) {
      message.error('Failed to create admin');
    }
  };

  return (
    <div>
      <h2>Admin Management</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add New Admin
      </Button>
      <Table columns={columns} dataSource={admins} rowKey="id" />

      <Modal
        title="Add/Edit Admin"
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
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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

export default Admin;

// This page is deprecated. Please use groups/index.tsx for groups list or groups/[id].tsx for profile.

import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      message.error('Failed to fetch groups');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Teacher',
      dataIndex: ['teacher', 'full_name'],
      key: 'teacher',
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

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create group');

      message.success('Group created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchGroups();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (record: { id: any; }) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: any) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete group');

      message.success('Group deleted successfully');
      fetchGroups();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Groups</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Group
      </Button>
      <Table columns={columns} dataSource={groups} rowKey="id" loading={loading} /> {/* Added loading prop */}

      <Modal
        title="Group Form"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} onFinish={handleSubmit}> {/* Added onFinish prop */}
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Group Name" />
          </Form.Item>
          <Form.Item name="teacherId" rules={[{ required: true }]}>
            <Input placeholder="Teacher ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups;
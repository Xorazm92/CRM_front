
import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Groups</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Group
      </Button>
      <Table columns={columns} dataSource={groups} rowKey="id" />
      
      <Modal
        title="Group Form"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form}>
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


import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      message.error('Failed to fetch courses');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
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

  const handleSubmit = async (values) => {
    try {
      const method = form.getFieldValue('id') ? 'PATCH' : 'POST';
      const url = form.getFieldValue('id') 
        ? `/api/courses/${form.getFieldValue('id')}` 
        : '/api/courses';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      message.success(`Course ${method === 'POST' ? 'created' : 'updated'} successfully`);
      setIsModalVisible(false);
      form.resetFields();
      fetchCourses();
    } catch (error) {
      message.error(`Failed to ${form.getFieldValue('id') ? 'update' : 'create'} course`);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      message.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      message.error('Failed to delete course');
    }
  };

  return (
    <div>
      <h2>Courses</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Add Course
      </Button>
      <Table columns={columns} dataSource={courses} rowKey="id" />
      
      <Modal
        title="Course Form"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Course Name" />
          </Form.Item>
          <Form.Item name="duration" rules={[{ required: true }]}>
            <Input placeholder="Duration (months)" />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true }]}>
            <Input placeholder="Price" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Courses;

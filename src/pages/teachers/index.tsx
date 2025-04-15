import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teachersService } from '../../services/teachers';

interface Teacher {
  id: string;
  full_name: string;
  phone: string;
  subject: string;
}

const Teachers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: teachersService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: teachersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      message.success('Teacher added successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  interface UpdateTeacherParams {
    id: number;
    data: any;
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTeacherParams) =>
      teachersService.update(id.toString(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      message.success('Teacher updated successfully');
      setIsModalVisible(false);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teachersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      message.success('Teacher deleted successfully');
    },
  });

  const handleAdd = () => {
    setEditingTeacher(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue(teacher);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (values: any) => {
    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Teacher) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id.toString())}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Add Teacher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teachers?.data}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please input subject!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTeacher ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;

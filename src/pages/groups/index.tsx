
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { groupsService } from '../../services/groups';

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery('groups', groupsService.getAll);

  const createMutation = useMutation(groupsService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('groups');
      message.success('Guruh muvaffaqiyatli yaratildi');
      setIsModalOpen(false);
      form.resetFields();
    },
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { title: 'O\'quvchilar soni', dataIndex: 'studentsCount', key: 'studentsCount' },
    { title: 'O\'qituvchi', dataIndex: 'teacherName', key: 'teacherName' },
    { title: 'Kurs', dataIndex: 'courseName', key: 'courseName' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary">Tahrirlash</Button>
          <Button danger>O'chirish</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Yangi guruh qo'shish
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={groups} 
        loading={isLoading}
        rowKey="id" 
      />

      <Modal
        title="Yangi guruh qo'shish"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          onFinish={(values) => createMutation.mutate(values)}
        >
          <Form.Item
            name="name"
            label="Guruh nomi"
            rules={[{ required: true, message: 'Guruh nomini kiriting!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="teacherId"
            label="O'qituvchi"
            rules={[{ required: true, message: 'O\'qituvchini tanlang!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="courseId"
            label="Kurs"
            rules={[{ required: true, message: 'Kursni tanlang!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups;

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '../../services/groups';

const Groups = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsService.getAll
  });

  const createMutation = useMutation({
    mutationFn: groupsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      message.success("Guruh qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { title: "O'qituvchi", dataIndex: ['teacher', 'fullName'], key: 'teacher' },
    { title: 'Kurs', dataIndex: ['course', 'name'], key: 'course' },
    { title: "O'quvchilar soni", dataIndex: 'studentsCount', key: 'studentsCount' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_, record) => (
        <Button.Group>
          <Button type="link">Tahrirlash</Button>
          <Button type="link" danger>O'chirish</Button>
        </Button.Group>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Guruh qo'shish
      </Button>
      <Table
        columns={columns}
        dataSource={groups}
        loading={isLoading}
        rowKey="id"
      />
      <Modal
        title="Guruh qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={createMutation.mutate} layout="vertical">
          <Form.Item name="name" label="Nomi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="teacherId" label="O'qituvchi" rules={[{ required: true }]}>
            <Select placeholder="O'qituvchini tanlang" />
          </Form.Item>
          <Form.Item name="courseId" label="Kurs" rules={[{ required: true }]}>
            <Select placeholder="Kursni tanlang" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Groups;
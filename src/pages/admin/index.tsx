
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminService } from '../../services/admin';

const AdminPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: admins, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: adminService.getAll
  });

  const createMutation = useMutation({
    mutationFn: adminService.create,
    onSuccess: () => {
      message.success('Admin yaratildi');
      setIsModalOpen(false);
      refetch();
    }
  });

  const columns = [
    { title: 'Ism', dataIndex: 'full_name' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Role', dataIndex: 'role' },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger onClick={() => deleteMutation.mutate(record.id)}>
          O'chirish
        </Button>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{marginBottom: 16}}>
        Admin qo'shish
      </Button>
      
      <Table columns={columns} dataSource={admins} />

      <Modal 
        title="Yangi admin"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={createMutation.mutate}>
          <Form.Item name="full_name" rules={[{ required: true }]}>
            <Input placeholder="Ism" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Parol" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;

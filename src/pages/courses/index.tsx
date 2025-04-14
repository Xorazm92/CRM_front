
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courseService } from '../../services/courses';

const CoursesPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: courses, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getAll
  });

  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      message.success('Kurs yaratildi');
      setIsModalOpen(false);
      refetch();
    }
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name' },
    { title: 'Davomiyligi', dataIndex: 'duration' },
    { title: 'Narxi', dataIndex: 'price' },
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
        Kurs qo'shish
      </Button>
      
      <Table columns={columns} dataSource={courses} />

      <Modal 
        title="Yangi kurs"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={createMutation.mutate}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Kurs nomi" />
          </Form.Item>
          <Form.Item name="duration" rules={[{ required: true }]}>
            <Input placeholder="Davomiyligi" />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true }]}>
            <Input type="number" placeholder="Narxi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursesPage;

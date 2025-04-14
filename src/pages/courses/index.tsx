
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courses';

const CoursesPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: courseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      message.success("Kurs muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      message.success("Kurs muvaffaqiyatli o'chirildi");
    }
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name' },
    { title: 'Davomiyligi', dataIndex: 'duration' },
    { title: 'Narxi', dataIndex: 'price' },
    {
      title: 'Amallar',
      render: (_, record) => (
        <Button danger onClick={() => deleteMutation.mutate(record.id)}>
          O'chirish
        </Button>
      )
    }
  ];

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)} 
        style={{ marginBottom: 16 }}
      >
        Yangi kurs qo'shish
      </Button>

      <Table 
        loading={isLoading}
        columns={columns} 
        dataSource={courses} 
        rowKey="id"
      />

      <Modal 
        title="Yangi kurs"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={createMutation.mutate}>
          <Form.Item 
            name="name" 
            rules={[{ required: true, message: "Kurs nomini kiriting" }]}
          >
            <Input placeholder="Kurs nomi" />
          </Form.Item>
          <Form.Item 
            name="duration" 
            rules={[{ required: true, message: "Davomiyligini kiriting" }]}
          >
            <Input placeholder="Davomiyligi" />
          </Form.Item>
          <Form.Item 
            name="price" 
            rules={[{ required: true, message: "Narxini kiriting" }]}
          >
            <Input type="number" placeholder="Narxi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursesPage;

import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courses';

interface Course {
  id: number;
  name: string;
  duration: string;
  price: number;
}

const CoursesPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseService.getAll();
      return response.data;
    }
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => courseService.updat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      message.success("Kurs muvaffaqiyatli tahrirlandi");
      setIsModalOpen(false);
      setEditingCourse(null);
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

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue(course);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    { title: 'Nomi', dataIndex: 'name' },
    { title: 'Davomiyligi', dataIndex: 'duration' },
    { title: 'Narxi', dataIndex: 'price' },
    {
      title: 'Amallar',
      render: (_: any, record: Course) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Tahrirlash
          </Button>
          <Button danger onClick={() => deleteMutation.mutate(record.id)}>
            O'chirish
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Button 
        type="primary" 
        onClick={handleAdd} 
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
        title={editingCourse ? "Kursni tahrirlash" : "Yangi kurs"}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingCourse(null); }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item 
            name="name" 
            label="Kurs nomi"
            rules={[{ required: true, message: "Kurs nomini kiriting" }]}
          >
            <Input placeholder="Kurs nomi" />
          </Form.Item>
          <Form.Item 
            name="duration" 
            label="Davomiyligi"
            rules={[{ required: true, message: "Davomiyligini kiriting" }]}
          >
            <Input placeholder="Davomiyligi" />
          </Form.Item>
          <Form.Item 
            name="price" 
            label="Narxi"
            rules={[{ required: true, message: "Narxini kiriting" }]}
          >
            <Input type="number" placeholder="Narxi" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? 'Tahrirlash' : "+ Qo'shish"}
              </Button>
              <Button onClick={() => { setIsModalOpen(false); setEditingCourse(null); }}>Bekor qilish</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursesPage;

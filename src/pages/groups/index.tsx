
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../../services/groups';
import { courseService } from '../../services/courses';

const GroupsPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getAll()
  });

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      message.success("Guruh muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: groupService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      message.success("Guruh muvaffaqiyatli o'chirildi");
    }
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name' },
    { title: 'Kurs', dataIndex: ['course', 'name'] },
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
        Yangi guruh qo'shish
      </Button>

      <Table 
        loading={isLoading}
        columns={columns} 
        dataSource={groups} 
        rowKey="id"
      />

      <Modal 
        title="Yangi guruh"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={createMutation.mutate}>
          <Form.Item 
            name="name" 
            rules={[{ required: true, message: "Guruh nomini kiriting" }]}
          >
            <Input placeholder="Guruh nomi" />
          </Form.Item>
          <Form.Item 
            name="course_id" 
            rules={[{ required: true, message: "Kursni tanlang" }]}
          >
            <Select placeholder="Kursni tanlang">
              {courses?.map(course => (
                <Select.Option key={course.id} value={course.id}>
                  {course.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupsPage;

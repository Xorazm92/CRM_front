
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { groupService } from '../../services/groups';

const GroupsPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.getAll
  });

  const createMutation = useMutation({
    mutationFn: groupService.create,
    onSuccess: () => {
      message.success('Guruh yaratildi');
      setIsModalOpen(false);
      refetch();
    }
  });

  const columns = [
    { title: 'Nomi', dataIndex: 'name' },
    { title: 'Kurs', dataIndex: 'course_name' },
    { title: "O'quvchilar soni", dataIndex: 'students_count' },
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
        Guruh qo'shish
      </Button>
      
      <Table columns={columns} dataSource={groups} />

      <Modal 
        title="Yangi guruh"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} onFinish={createMutation.mutate}>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Guruh nomi" />
          </Form.Item>
          <Form.Item name="course_id" rules={[{ required: true }]}>
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

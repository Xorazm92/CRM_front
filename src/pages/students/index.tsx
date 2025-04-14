
import { Table, Button, Space, Input, Modal, Form, message } from 'antd';
import { useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsService } from '../../services/students';

const Students = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsService.getAll().then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: studentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      message.success("O'quvchi muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: studentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      message.success("O'quvchi muvaffaqiyatli o'chirildi");
    }
  });

  const columns = [
    {
      title: 'Ism Familiya',
      dataIndex: 'full_name',
      key: 'full_name',
      filteredValue: [searchText],
      onFilter: (value: string, record: any) => 
        record.full_name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Guruh',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link">Tahrirlash</Button>
          <Button 
            type="link" 
            danger 
            onClick={() => deleteMutation.mutate(record.id)}
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Yangi o'quvchi
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={students} 
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title="Yangi o'quvchi qo'shish"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createMutation.mutate(values)}
        >
          <Form.Item
            name="full_name"
            label="Ism Familiya"
            rules={[{ required: true, message: "Iltimos, to'ldiring" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: "Iltimos, to'ldiring" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Guruh"
            rules={[{ required: true, message: "Iltimos, to'ldiring" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/students';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Added import statement

const Students = () => {
  const navigate = useNavigate(); // Added useNavigate hook
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState(''); 
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll()
  });

  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      message.success("O'quvchi muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      message.success("O'quvchi muvaffaqiyatli o'chirildi");
    }
  });

  const columns = [
    { title: 'Ism', dataIndex: 'firstName' },
    { title: 'Familiya', dataIndex: 'lastName' },
    { title: 'Telefon', dataIndex: 'phone' },
    { title: 'Guruh', dataIndex: ['group', 'name'] },
    {
      title: 'Amallar',
      render: (_: any, record: { id: string; }) => (
        <>
          <Button type="link" onClick={() => navigate(`/students/profile/${record.id}`)}>
            Profil
          </Button>
          <Button 
            type="link" 
            style={{marginRight:8}} 
            onClick={() => {
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Tahrirlash
          </Button>
          <Button danger onClick={() => deleteMutation.mutate(record.id)}>
            O'chirish
          </Button>
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}> 
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button 
          type="primary" 
          onClick={() => setIsModalOpen(true)} 
        >
          Yangi o'quvchi qo'shish
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={students?.filter((student: { firstName: any; lastName: any; }) => 
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchText.toLowerCase())
        )} 
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
          onFinish={createMutation.mutate}
        >
          <Form.Item
            name="firstName"
            label="Ism"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Familiya"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="groupId"
            label="Guruh"
            rules={[{ required: true }]}
          >
            <Select>
              {students?.groups?.map((group: { id: string | number; name: string }) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
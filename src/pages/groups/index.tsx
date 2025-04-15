
import  { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Card, Row, Col, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService } from '../../services/groups';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({ queryKey: ['groups'], queryFn: groupsService.getAll });

  const createMutation = useMutation({
    mutationFn: groupsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      message.success('Guruh muvaffaqiyatli yaratildi');
      setIsModalOpen(false);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: groupsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      message.success('Guruh muvaffaqiyatli o\'chirildi');
    },
  });

  const columns = [
    { 
      title: 'Guruh nomi',
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => <span style={{ color: '#1677FF', fontWeight: 500 }}>{text}</span>
    },
    { 
      title: 'O\'quvchilar soni',
      dataIndex: 'studentsCount',
      key: 'studentsCount',
      render: (count: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => {
        return <span style={{ color: '#52C41A' }}>{count}</span>;
      }
    },
    { title: 'O\'qituvchi', dataIndex: 'teacherName', key: 'teacherName' },
    { title: 'Kurs', dataIndex: 'courseName', key: 'courseName' },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: { id: string; }) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            style={{ color: '#1677FF' }}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            style={{ color: '#FF4D4F' }}
            onClick={() => deleteMutation.mutate(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Guruhlar</h2>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Yangi guruh
          </Button>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={groups} 
        loading={isLoading}
        rowKey="id"
        pagination={{
          position: ['bottomRight'],
          showSizeChanger: true,
          showTotal: (total) => `Jami ${total} ta`,
        }}
      />

      <Modal
        title="Yangi guruh qo'shish"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Form
          form={form}
          layout="vertical"
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
            <Select placeholder="O'qituvchini tanlang">
              {/* O'qituvchilar ro'yxati */}
            </Select>
          </Form.Item>

          <Form.Item
            name="courseId"
            label="Kurs"
            rules={[{ required: true, message: 'Kursni tanlang!' }]}
          >
            <Select placeholder="Kursni tanlang">
              {/* Kurslar ro'yxati */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Groups;

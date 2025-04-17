
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService, Payment } from '../../services/payments';
import { studentService } from '../../services/students';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const PaymentsPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsService.getAll
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const createMutation = useMutation({
    mutationFn: paymentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      message.success("To'lov muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: paymentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      message.success("To'lov o'chirildi");
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "O'quvchi",
      dataIndex: ['student', 'firstName'],
      render: (_: any, record: Payment) => 
        `${record.student?.firstName} ${record.student?.lastName}`
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} so'm`
    },
    {
      title: "To'lov turi",
      dataIndex: 'paymentType',
      render: (type: string) => type.toUpperCase()
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Amallar',
      render: (_: any, record: Payment) => (
        <Button danger onClick={() => deleteMutation.mutate(record.id)}>
          O'chirish
        </Button>
      )
    }
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)} 
        style={{ marginBottom: 16 }}
      >
        + Yangi to'lov
      </Button>

      <Table 
        columns={columns} 
        dataSource={payments} 
        rowKey="id"
      />

      <Modal
        title="Yangi to'lov qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={createMutation.mutate} layout="vertical">
          <Form.Item
            name="studentId"
            label="O'quvchi"
            rules={[{ required: true, message: "O'quvchini tanlang" }]}
          >
            <Select placeholder="O'quvchini tanlang">
              {students?.map((student: any) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Summa"
            rules={[{ required: true, message: "Summani kiriting" }]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="paymentType"
            label="To'lov turi"
            rules={[{ required: true, message: "To'lov turini tanlang" }]}
          >
            <Select>
              <Select.Option value="cash">Naqd</Select.Option>
              <Select.Option value="card">Karta</Select.Option>
              <Select.Option value="transfer">O'tkazma</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Izoh">
            <Input.TextArea />
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

export default PaymentsPage;

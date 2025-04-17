import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Select, DatePicker, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../../services/payments';
import { studentService } from '../../services/students';

const Payments = () => {
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
      message.success("To'lov qo'shildi");
      setIsModalOpen(false);
      form.resetFields();
    }
  });

  const columns = [
    { 
      title: "O'quvchi",
      dataIndex: ['student', 'full_name'], //Retaining original dataIndex for consistency
      key: 'student',
      render: (student) => student?.full_name || '' //Handling potential null values
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: any) => `$${amount}`, //Retaining original rendering for currency format
    },
    {
      title: 'Sana',
      dataIndex: 'payment_date', //Retaining original dataIndex
      key: 'date',
      render: (date: any) => date ? new Date(date).toLocaleDateString() : '' //Formatting date
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'paid' ? 'green' : 'red' }}>
          {status === 'paid' ? "To'langan" : "To'lanmagan"}
        </span>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        To'lov qo'shish
      </Button>
      <Table
        columns={columns}
        dataSource={payments?.data} //Retaining original dataSource access
        loading={isLoading}
        rowKey="id"
      />
      <Modal
        title="To'lov qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={() => createMutation.mutate(form.getFieldsValue())} layout="vertical"> {/* Using form.getFieldsValue for data submission */}
          <Form.Item name="student_id" label="O'quvchi" rules={[{ required: true }]}>
            <Select
              placeholder="O'quvchini tanlang"
              options={students?.data?.map(s => ({ 
                value: s.id, 
                label: `${s.full_name}` //Using full_name from original data
              }))}
            />
          </Form.Item>
          <Form.Item name="amount" label="Summa" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="payment_date" label="Sana" rules={[{ required: true }]}> {/* Using original field name */}
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}> {/* Adding status field */}
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
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

export default Payments;
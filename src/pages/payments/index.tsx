
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, InputNumber } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../../services/payments';
import { studentsService } from '../../services/students';

const Payments = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsService.getAll
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.getAll
  });

  const createMutation = useMutation({
    mutationFn: paymentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      message.success('Payment added successfully');
      setIsModalVisible(false);
      form.resetFields();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => paymentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      message.success('Payment updated successfully');
      setIsModalVisible(false);
      form.resetFields();
    }
  });

  const columns = [
    {
      title: 'Student',
      dataIndex: ['student', 'full_name'],
      key: 'student',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    form.setFieldsValue(payment);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (editingPayment) {
      updateMutation.mutate({ id: editingPayment.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Add Payment
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={payments?.data}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title={editingPayment ? 'Edit Payment' : 'Add Payment'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="student_id"
            label="Student"
            rules={[{ required: true, message: 'Please select student!' }]}
          >
            <Select>
              {students?.data?.map(student => (
                <Select.Option key={student.id} value={student.id}>
                  {student.full_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input amount!' }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPayment ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;

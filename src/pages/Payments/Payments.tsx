import React from 'react';
import { Table, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { paymentsService } from '../../services/payments';
import HeaderTitle from '../../components/HeaderTitle/HeaderTitle';

const Payments = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsService.getAllStudentPayments
  });

  const columns = [
    {
      title: 'To\'lov ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student: any) => `${student.firstName} ${student.lastName}`
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} so'm`
    },
    {
      title: 'To\'lov sanasi',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <div className="p-6">
      <HeaderTitle title="To'lovlar" />
      <Table 
        columns={columns}
        dataSource={payments}
        loading={isLoading}
        rowKey="id"
      />
    </div>
  );
};

export default Payments;

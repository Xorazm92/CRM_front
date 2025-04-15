
import React from 'react';
import { Card, Descriptions, Tabs, Table, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentsService } from '../../../services/students';
import { paymentsService } from '../../../services/payments';

const StudentProfile = () => {
  const { id } = useParams();

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.getById(id)
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['student-payments', id],
    queryFn: () => paymentsService.getByStudentId(id)
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['student-attendance', id],
    queryFn: () => studentsService.getAttendance(id)
  });

  const items = [
    {
      key: '1',
      label: 'Asosiy ma\'lumotlar',
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Ism Familiya">{student?.full_name}</Descriptions.Item>
          <Descriptions.Item label="Telefon">{student?.phone}</Descriptions.Item>
          <Descriptions.Item label="Guruh">{student?.group?.name}</Descriptions.Item>
          <Descriptions.Item label="Holati">
            <Tag color={student?.status === 'active' ? 'green' : 'red'}>
              {student?.status === 'active' ? 'Faol' : 'Nofaol'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: 'To\'lovlar tarixi',
      children: (
        <Table 
          loading={paymentsLoading}
          dataSource={payments} 
          columns={[
            {
              title: 'Sana',
              dataIndex: 'payment_date',
              key: 'payment_date',
            },
            {
              title: 'Summa',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount) => `${amount.toLocaleString()} so'm`,
            },
            {
              title: 'Holat',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={status === 'completed' ? 'green' : 'orange'}>
                  {status === 'completed' ? 'To\'langan' : 'Kutilmoqda'}
                </Tag>
              ),
            },
          ]} 
        />
      ),
    },
    {
      key: '3',
      label: 'Davomat',
      children: (
        <Table 
          loading={attendanceLoading}
          dataSource={attendance} 
          columns={[
            {
              title: 'Sana',
              dataIndex: 'date',
              key: 'date',
            },
            {
              title: 'Holat',
              dataIndex: 'status',
              key: 'status',
              render: (status) => (
                <Tag color={
                  status === 'present' ? 'green' : 
                  status === 'late' ? 'orange' : 'red'
                }>
                  {
                    status === 'present' ? 'Kelgan' : 
                    status === 'late' ? 'Kechikkan' : 'Kelmagan'
                  }
                </Tag>
              ),
            },
            {
              title: 'Izoh',
              dataIndex: 'note',
              key: 'note',
            }
          ]} 
        />
      ),
    },
  ];

  return (
    <Card loading={studentLoading}>
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default StudentProfile;

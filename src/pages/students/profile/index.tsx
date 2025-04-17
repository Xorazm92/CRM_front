import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tabs, Table, Tag, Descriptions, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../../services/students';

const StudentProfile = () => {
  const { id } = useParams();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(id as string)
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['student-payments', id],
    queryFn: () => studentService.getPayments(id as string)
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['student-attendance', id],
    queryFn: () => studentService.getAttendance(id as string)
  });

  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ['student-grades', id],
    queryFn: () => studentService.getGrades(id as string)
  });

  if (isLoading) return <Spin />;

  return (
    <Card>
      <Descriptions title="O'quvchi ma'lumotlari" bordered>
        <Descriptions.Item label="Ism">{student?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Familiya">{student?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Telefon">{student?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{student?.email}</Descriptions.Item>
        <Descriptions.Item label="Guruh">{student?.group?.name}</Descriptions.Item>
      </Descriptions>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'To\'lovlar',
            children: (
              <Table 
                loading={paymentsLoading}
                dataSource={payments} 
                columns={[
                  {
                    title: 'Sana',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: 'Summa',
                    dataIndex: 'amount',
                    key: 'amount',
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => (
                      <Tag color={status === 'paid' ? 'green' : 'red'}>
                        {status === 'paid' ? "To'langan" : "To'lanmagan"}
                      </Tag>
                    ),
                  }
                ]} 
              />
            ),
          },
          {
            key: '2',
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
                        {status === 'present' ? 'Keldi' : 
                         status === 'late' ? 'Kechikdi' : 'Kelmadi'}
                      </Tag>
                    ),
                  }
                ]} 
              />
            ),
          },
          {
            key: '3',
            label: 'Baholar',
            children: (
              <Table 
                loading={gradesLoading}
                dataSource={grades} 
                columns={[
                  {
                    title: 'Fan',
                    dataIndex: 'subject',
                    key: 'subject',
                  },
                  {
                    title: 'Baho',
                    dataIndex: 'grade',
                    key: 'grade',
                  },
                  {
                    title: 'Sana',
                    dataIndex: 'date',
                    key: 'date',
                  }
                ]} 
              />
            ),
          }
        ]}
      />
    </Card>
  );
};

export default StudentProfile;
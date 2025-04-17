// Student profile page. Use this for showing a single student's details.
import React from 'react';
import { Card, Descriptions, Tabs, Table, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../../services/students';
import { paymentsService } from '../../../services/payments';

const StudentProfile = () => {
  const { id } = useParams();

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => {
      if (!id) throw new Error('Student ID is required');
      return studentService.getById(id);
    }
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['student-payments', id],
    queryFn: () => {
      if (!id) throw new Error('Student ID is required');
      return paymentsService.getByStudentId(id);
    }
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['student-attendance', id],
    queryFn: () => {
      if (!id) throw new Error('Student ID is required');
      return studentService.getAttendance(id);
    }
  });

  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ['student-grades', id],
    queryFn: () => {
      if (!id) throw new Error('Student ID is required');
      return studentService.getGrades(id);
    }
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
          dataSource={payments?.data} 
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
              render: (grade) => (
                <Tag color={
                  grade >= 90 ? 'green' : 
                  grade >= 70 ? 'blue' :
                  grade >= 60 ? 'orange' : 'red'
                }>
                  {grade}
                </Tag>
              ),
            },
            {
              title: 'Sana',
              dataIndex: 'date',
              key: 'date',
            }
          ]} 
        />
      ),
    },
    {
      key: '4',
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


import React from 'react';
import { Card, Row, Col, Descriptions, Table, Tag, Statistic } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { studentService } from '../../../services/students';

const StudentProfile = () => {
  const { id } = useParams();
  
  const { data: student, isLoading } = useQuery(['student', id], () => 
    studentService.getById(id as string)
  );

  const paymentColumns = [
    { title: 'Sana', dataIndex: 'date', key: 'date' },
    { title: 'Summa', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'green' : 'red'}>
          {status === 'paid' ? "To'langan" : "To'lanmagan"}
        </Tag>
      )
    }
  ];

  const attendanceColumns = [
    { title: 'Sana', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (status: string) => (
        <Tag color={status === 'present' ? 'green' : 'red'}>
          {status === 'present' ? 'Kelgan' : 'Kelmagan'}
        </Tag>
      )
    }
  ];

  if (isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Descriptions title="O'quvchi ma'lumotlari" bordered>
              <Descriptions.Item label="Ism">{student?.firstName}</Descriptions.Item>
              <Descriptions.Item label="Familiya">{student?.lastName}</Descriptions.Item>
              <Descriptions.Item label="Telefon">{student?.phone}</Descriptions.Item>
              <Descriptions.Item label="Guruh">{student?.group?.name}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="To'lovlar" value={student?.totalPayments} suffix="so'm" />
              <Statistic title="Davomat" value={student?.attendanceRate} suffix="%" />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="To'lovlar tarixi">
              <Table 
                columns={paymentColumns} 
                dataSource={student?.payments} 
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Davomat tarixi">
              <Table 
                columns={attendanceColumns} 
                dataSource={student?.attendance} 
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StudentProfile;

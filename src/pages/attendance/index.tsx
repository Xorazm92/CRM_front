
import React, { useState } from 'react';
import { Table, DatePicker, Select, Card, Row, Col, Typography } from 'antd';
import { useQuery } from 'react-query';
import { groupsService } from '../../services/groups';

const { Title } = Typography;

const Attendance = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();

  const { data: groups, isLoading: groupsLoading } = useQuery('groups', groupsService.getAll);

  const columns = [
    {
      title: "O'quvchi",
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          options={[
            { value: 'present', label: 'Keldi' },
            { value: 'absent', label: 'Kelmadi' },
            { value: 'late', label: 'Kechikdi' },
          ]}
        />
      ),
    },
    {
      title: 'Izoh',
      dataIndex: 'note',
      key: 'note',
    }
  ];

  return (
    <Card>
      <Title level={2}>Davomat</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <DatePicker 
            style={{ width: '100%' }}
            onChange={(date) => setSelectedDate(date?.toISOString())}
            placeholder="Kunni tanlang"
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Guruhni tanlang"
            onChange={(value) => setSelectedGroup(value)}
            loading={groupsLoading}
            options={groups?.map(group => ({
              value: group.id,
              label: group.name
            }))}
          />
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={[]} 
        loading={false}
        pagination={false}
      />
    </Card>
  );
};

export default Attendance;

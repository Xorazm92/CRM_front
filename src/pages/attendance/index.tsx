
import React, { useState } from 'react';
import { Table, Button, DatePicker, Select, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../../services/attendance';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const queryClient = useQueryClient();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedGroup],
    queryFn: () => attendanceService.getAll({ date: selectedDate, groupId: selectedGroup })
  });

  const createMutation = useMutation({
    mutationFn: attendanceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      message.success('Davomat saqlandi');
    }
  });

  const columns = [
    { title: 'O\'quvchi', dataIndex: 'student_name', key: 'student_name' },
    { 
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
          options={[
            { value: 'present', label: 'Keldi' },
            { value: 'absent', label: 'Kelmadi' },
            { value: 'late', label: 'Kechikdi' }
          ]}
        />
      )
    }
  ];

  const handleStatusChange = (studentId, status) => {
    createMutation.mutate({ studentId, status, date: selectedDate });
  };

  return (
    <div>
      <h1>Davomat</h1>
      <div style={{ marginBottom: 16 }}>
        <DatePicker 
          onChange={(date) => setSelectedDate(date)} 
          style={{ marginRight: 16 }}
        />
        <Select
          placeholder="Guruhni tanlang"
          onChange={(value) => setSelectedGroup(value)}
          style={{ width: 200 }}
        />
      </div>
      <Table 
        columns={columns} 
        dataSource={attendance} 
        loading={isLoading}
        rowKey="id"
      />
    </div>
  );
};

export default Attendance;

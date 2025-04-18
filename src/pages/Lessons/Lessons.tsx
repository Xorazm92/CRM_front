
import React from 'react';
import { Table, Button, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/DataTable/DataTable';
import { lessonService } from '../../services/lessons';

const Lessons = () => {
  const queryClient = useQueryClient();
  
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAll
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (group) => group?.name
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => teacher?.fullName
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Lessons</h1>
        <Button type="primary" onClick={() => {}}>Add Lesson</Button>
      </div>
      <DataTable 
        columns={columns}
        dataSource={lessons}
        loading={isLoading}
      />
    </div>
  );
};

export default Lessons;

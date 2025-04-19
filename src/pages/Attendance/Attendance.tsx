
import { useState } from 'react';
import { DatePicker, Table, Select, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '../../services/attendance';
import HeaderTitle from '../../components/HeaderTitle/HeaderTitle';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [selectedGroup, setSelectedGroup] = useState<string>();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedGroup],
    queryFn: () => attendanceService.getAll({ date: new Date(selectedDate), groupId: selectedGroup })
  });

  const columns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student: any) => `${student.firstName} ${student.lastName}`
    },
    {
      title: 'Guruh',
      dataIndex: ['group', 'name'],
      key: 'group',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded ${
          status === 'PRESENT' ? 'bg-green-100 text-green-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {status === 'PRESENT' ? 'Keldi' : 'Kelmadi'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <HeaderTitle title="Davomat" />
      <div className="flex gap-4 mb-4">
        <DatePicker 
          onChange={(date) => setSelectedDate(date?.toISOString() || '')}
          className="w-48"
        />
        <Select
          placeholder="Guruhni tanlang"
          onChange={setSelectedGroup}
          className="w-48"
          options={[
            { value: '1', label: 'Front-end A' },
            { value: '2', label: 'Back-end A' }
          ]}
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

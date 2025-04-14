
import { Table, Button, Space, Input } from 'antd';
import { useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const Students = () => {
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Ism Familiya',
      dataIndex: 'full_name',
      key: 'full_name',
      filteredValue: [searchText],
      onFilter: (value: string, record: any) => 
        record.full_name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Guruh',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Amallar',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">Tahrirlash</Button>
          <Button type="link" danger>O'chirish</Button>
        </Space>
      ),
    },
  ];

  const dummyData = [
    {
      key: '1',
      full_name: 'Abdullayev Abror',
      phone: '+998901234567',
      group: 'Frontend-1',
    },
    // Keyinchalik backend dan kelgan ma'lumotlar bilan to'ldiriladi
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Qidirish..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Yangi o'quvchi
        </Button>
      </div>
      <Table columns={columns} dataSource={dummyData} />
    </div>
  );
};

export default Students;


// import React, { useState, useEffect } from 'react';
// import { Table, Tag, DatePicker, Button, message } from 'antd';
// import instance from '../../api/axios';
// import { TransactionType, TransactionStatus } from '../../types/models';
// import dayjs from 'dayjs';

// const Transactions: React.FC = () => {
//   const [transactions, setTransactions] = useState<TransactionType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

//   const fetchTransactions = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (dateRange[0] && dateRange[1]) {
//         params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
//         params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
//       }
//       // Fetch transactions, student payments, and teacher salaries in parallel
//       const [transactionsRes, studentPaymentsRes, teacherSalariesRes] = await Promise.all([
//         instance.get(`/transactions?${params.toString()}`),
//         instance.get(`/payments/student-payments?${params.toString()}`),
//         instance.get(`/payments/teacher-salaries?${params.toString()}`)
//       ]);
//       // Normalize and combine all
//       const txs = (transactionsRes.data || []).map((item: any) => ({
//         ...item,
//         _source: 'transaction',
//         created_at: item.createdAt || item.created_at,
//         description: item.reason || '',
//       }));
//       const studentPayments = (studentPaymentsRes.data || []).map((item: any) => ({
//         ...item,
//         _source: 'student',
//         id: item.id || item._id,
//         created_at: item.createdAt || item.created_at,
//         amount: item.amount,
//         type: 'PAYMENT',
//         status: item.status,
//         description: '',
//       }));
//       const teacherSalaries = (teacherSalariesRes.data || []).map((item: any) => ({
//         ...item,
//         _source: 'teacher',
//         id: item.id || item._id,
//         created_at: item.createdAt || item.created_at,
//         amount: item.amount,
//         type: 'SALARY',
//         status: item.status,
//         description: item.description || '',
//       }));
//       setTransactions([...txs, ...studentPayments, ...teacherSalaries]);
//     } catch (err) {
//       message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [dateRange]);

//   const columns = [
//     {
//       title: 'Sana',
//       dataIndex: 'created_at',
//       key: 'created_at',
//       render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm')
//     },
//     {
//       title: 'Summa',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount: number) => amount.toLocaleString('uz-UZ') + ' so\'m'
//     },
//     {
//       title: 'Turi',
//       dataIndex: 'type',
//       key: 'type',
//       render: (type: string) => (
//         <Tag color={type === 'PAYMENT' ? 'green' : type === 'SALARY' ? 'blue' : type === 'REFUND' ? 'red' : 'default'}>
//           {type === 'PAYMENT' ? "To'lov" : type === 'SALARY' ? "Oylik" : type === 'REFUND' ? "Qaytarish" : type}
//         </Tag>
//       )
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => (
//         <Tag color={
//           status === 'SUCCESS' || status === 'COMPLETED' ? 'green' :
//           status === 'PENDING' ? 'orange' : 'red'
//         }>
//           {status}
//         </Tag>
//       )
//     },
//     {
//       title: 'Izoh',
//       dataIndex: 'description',
//       key: 'description'
//     },
//     {
//       title: 'Manba',
//       dataIndex: '_source',
//       key: '_source',
//       render: (src: string) => src === 'student' ? "O‘quvchi to‘lovi" : src === 'teacher' ? "O‘qituvchi oyligi" : "Tranzaksiya"
//     }
//   ];

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
//         <DatePicker.RangePicker
//           onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
//           style={{ width: 300 }}
//         />
//         <Button type="primary" onClick={fetchTransactions}>
//           Yangilash
//         </Button>
//       </div>
      
//       <Table
//         columns={columns}
//         dataSource={transactions}
//         loading={loading}
//         rowKey="id"
//         pagination={{
//           total: transactions.length,
//           pageSize: 10,
//           showTotal: (total) => `Jami: ${total} ta`,
//         }}
//       />
//     </div>
//   );
// };

// export default Transactions;




import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, DatePicker, Input, Select, message, Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import instance from '../../api/axios';
import AddTransactionModal from './AddTransactionModal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [filters, setFilters] = useState({
    dateRange: null,
    type: undefined,
    status: undefined,
    search: ''
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange[0].format('YYYY-MM-DD'));
        params.append('endDate', filters.dateRange[1].format('YYYY-MM-DD'));
      }
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await instance.get(`/transactions?${params.toString()}`);
      setTransactions(response.data);
      
      // Calculate stats
      const income = response.data.reduce((sum, t) => t.type === 'INCOME' ? sum + t.amount : sum, 0);
      const expense = response.data.reduce((sum, t) => t.type === 'EXPENSE' ? sum + t.amount : sum, 0);
      setStats({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense
      });
    } catch (err) {
      message.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm')
    },
    {
      title: "Kimdan (manba)",
      dataIndex: 'source_name',
      key: 'source_name',
    },
    {
      title: "Kimga (qabul qiluvchi)",
      dataIndex: 'target_name',
      key: 'target_name',
    },
    {
      title: 'Summa',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount?.toLocaleString('uz-UZ') + " so'm"
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'INCOME' ? 'green' : 'red'}>
          {type === 'INCOME' ? "Kirim" : "Chiqim"}
        </Tag>
      )
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'SUCCESS' ? 'green' : 
          status === 'PENDING' ? 'orange' : 'red'
        }>
          {status === 'SUCCESS' ? "Muvaffaqiyatli" :
           status === 'PENDING' ? "Kutilmoqda" : "Bekor qilingan"}
        </Tag>
      )
    },
    {
      title: 'Izoh',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Statistic 
            title="Jami kirim"
            value={stats.totalIncome}
            suffix="so'm"
            prefix={<ArrowUpOutlined style={{ color: '#3f8600' }} />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Jami chiqim"
            value={stats.totalExpense}
            suffix="so'm"
            prefix={<ArrowDownOutlined style={{ color: '#cf1322' }} />}
          />
        </Card>
        <Card>
          <Statistic 
            title="Balans"
            value={stats.balance}
            suffix="so'm"
            valueStyle={{ color: stats.balance >= 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <DatePicker.RangePicker 
          onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
          style={{ width: 300 }}
          placeholder={["Boshlanish sanasi", "Tugash sanasi"]}
        />
        <Select
          style={{ width: 150 }}
          placeholder="Turi tanlang"
          allowClear
          onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          options={[
            { value: 'INCOME', label: 'Kirim' },
            { value: 'EXPENSE', label: 'Chiqim' }
          ]}
        />
        <Select
          style={{ width: 150 }}
          placeholder="Holat tanlang"
          allowClear
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          options={[
            { value: 'SUCCESS', label: 'Muvaffaqiyatli' },
            { value: 'PENDING', label: 'Kutilmoqda' },
            { value: 'FAILED', label: 'Bekor qilingan' }
          ]}
        />
        <Input.Search
          placeholder="Qidiruv..."
          style={{ width: 200 }}
          onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
          enterButton="Qidirish"
        />
        <Button type="primary" onClick={() => setShowAdd(true)}>
          + Yangi o'tkazma
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="id"
        pagination={{
          total: transactions.length,
          pageSize: 10,
          showTotal: (total) => `Jami: ${total} ta`,
        }}
      />

      <AddTransactionModal 
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Transactions;

import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import Toast from "../../components/Toast";
import AddPaymentModal from "./AddPaymentModal";
import EditPaymentModal from "./EditPaymentModal";
import { getEntityId } from "../../utils/getEntityId";
import { Select, Input, DatePicker, Button, Tabs } from "antd";
import dayjs from "dayjs";
import StudentPayments from "./StudentPayments";
import TeacherPayments from "./TeacherPayments";
import Debtors from "./Debtors";
import Discounts from "../../Pages/Discounts/Discounts";

import { useAuthStore } from '../../store/useAuthStore';
import styles from './Payments.module.css';

interface Payment {
  id: number;
  student: {
    name: string;
    full_name: string;
    fullName: string;
    student_id: number;
  };
  createdAt: string;
  date: string;
  amount: number;
  status: string;
}

interface ToastType {
  message: string;
  type: 'success' | 'error' | undefined;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastType>({ message: '', type: undefined });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<Payment | null>(null);

  // Filter state
  const [filterStudent, setFilterStudent] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterDate, setFilterDate] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string>("");

  const [students, setStudents] = useState<{ user_id: string; name: string }[]>([]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let params: any = {};
      if (filterStudent) params.student_id = filterStudent;
      if (filterType) params.payment_type = filterType;
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate;
      if (searchText) params.q = searchText;
      const res = await instance.get("/payments/student-payments", { params });
      let data = res.data;
      console.log('Payments API response:', data);
      if (Array.isArray(data)) {
        setPayments(data);
      } else if (Array.isArray(data.results)) {
        setPayments(data.results);
      } else if (Array.isArray(data.data)) {
        setPayments(data.data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Payments API error:', err);
      setError("To‘lovlarni olishda xatolik");
      if (err instanceof Error) {
        setToast({ message: err.message, type: 'error' });
      } else {
        setToast({ message: "Unknown error", type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    // Talabalar ro'yxatini yuklab olamiz
    instance.get("/users?role=STUDENT&limit=1000").then(res => {
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setStudents(arr.filter((s: any) => !!(s.user_id || s._id)).map((s: any) => ({ user_id: s.user_id || s._id, name: s.lastname + ' ' + s.name })));
    }).catch(() => setStudents([]));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/payments/student/${getEntityId(id) || id}`);
      setToast({ message: "To‘lov o‘chirildi!", type: 'success' });
      fetchPayments();
    } catch (err) {
      if (err instanceof Error) {
        setToast({ message: err.message, type: 'error' });
      } else {
        setToast({ message: "Unknown error", type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter UI
  const filterBar = (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <Select
        placeholder="Talaba tanlang"
        allowClear
        style={{ minWidth: 180 }}
        onChange={v => setFilterStudent(v)}
        value={filterStudent}
        options={students
          .filter(s => !!s.user_id)
          .map(s => ({ value: s.user_id, label: s.name }))}
        filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
      />
      <Select
        placeholder="To‘lov turi"
        allowClear
        style={{ minWidth: 140 }}
        onChange={v => setFilterType(v)}
        value={filterType}
        options={[
          { value: 'MONTHLY', label: 'Oylik' },
          { value: 'COURSE', label: 'Kurs uchun' },
          { value: 'OTHER', label: 'Boshqa' },
        ]}
        filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
      />
      <Select
        placeholder="Status"
        allowClear
        style={{ minWidth: 120 }}
        onChange={v => setFilterStatus(v)}
        value={filterStatus}
        options={[
          { value: 'pending', label: 'Kutilmoqda' },
          { value: 'paid', label: 'To‘langan' },
        ]}
        filterOption={(input, option) => typeof option?.label === 'string' && option.label.toLowerCase().includes(input.toLowerCase())}
      />
      <DatePicker
        placeholder="Sana"
        onChange={d => setFilterDate(d ? dayjs(d).format("YYYY-MM-DD") : undefined)}
        value={filterDate ? dayjs(filterDate) : undefined}
        allowClear
      />
      <Input
        placeholder="Qidiruv..."
        style={{ minWidth: 160 }}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onPressEnter={fetchPayments}
      />
      <Button type="primary" onClick={fetchPayments}>Filtrlash</Button>
      <Button onClick={() => {
        setFilterStudent(undefined); setFilterType(undefined); setFilterStatus(undefined); setFilterDate(undefined); setSearchText(""); fetchPayments();
      }}>Tozalash</Button>
    </div>
  );

  const user = useAuthStore(state => state.user);

  return (
    <div className={styles.paymentsPage}>

      {/* Tabs for all payment modules, including the last tab for Pul o'tkazmalari (transactions) */}
      <Tabs
        defaultActiveKey="student"
        type="card"
        items={[
          {
            key: "student",
            label: "O‘quvchi to‘lovlari",
            children: (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ margin: 0 }}>O'quvchi to'lovlari tarixi</h2>
                  <Button type="primary" onClick={() => setShowAdd(true)}>To'lov qo'shish</Button>
                </div>
                <table className={styles.paymentsTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Talaba</th>
                      <th>Miqdor</th>
                      <th>To'lov turi</th>
                      <th>Sana</th>
                      <th>Status</th>
                      <th>Izoh</th>
                      <th>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.filter(p => p.student_id || p.student_name || p.full_name || p.fullName).length > 0 ? (
                      payments.filter(p => p.student_id || p.student_name || p.full_name || p.fullName)
                        .map((payment, idx) => (
                          <tr key={payment.id || payment._id}>
                            <td>{idx + 1}</td>
                            <td>{payment.student_name || payment.student?.name || payment.full_name || payment.fullName || '-'}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.type || payment.payment_type}</td>
                            <td>{payment.date}</td>
                            <td>{payment.status}</td>
                            <td>{payment.description || '-'}</td>
                            <td>{/* Amallar (edit/delete) */}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={8} className={styles.noPayments}>To‘lovlar topilmadi</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <AddPaymentModal
                  open={showAdd}
                  onClose={() => setShowAdd(false)}
                  onSuccess={fetchPayments}
                />
              </>
            )
          },
          {
            key: "teacher",
            label: "O‘qituvchiga oylik",
            children: <TeacherPayments teacherId={user?.role === 'teacher' ? user.user_id || user.id || user._id : ''} isAdmin={user?.role === 'admin'} />,
          },
          {
            key: "debtors",
            label: "Qarzdorlar",
            children: <Debtors />,
          },
          {
            key: "discounts",
            label: "Chegirmalar",
            children: <Discounts />,
          },
          {
            key: "transactions",
            label: <span style={{fontWeight:'bold',color:'#0a5'}}>Pul o'tkazmalari</span>,
            children: <div style={{padding: 0, background: '#fff'}}><TransactionsTab /></div>,
          }
        ]}
        tabBarStyle={{marginBottom: 24}}
      />
      {/* End Tabs */}

    </div>
  );
};

// --- Pul o'tkazmalari (Transaction) Tab uchun komponent ---
import AddTransactionModal from "./AddTransactionModal";
import { Table, Spin, Typography, message } from "antd";

const TransactionsTab: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [users, setUsers] = useState<{ user_id: string; name: string }[]>([]);
  const [filterUser, setFilterUser] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterDate, setFilterDate] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string>("");

  const fetchTransactions = () => {
    setLoading(true);
    let params: any = {};
    if (filterUser) params.user_id = filterUser;
    if (filterType) params.type = filterType;
    if (filterStatus) params.status = filterStatus;
    if (filterDate) params.date = filterDate;
    if (searchText) params.q = searchText;
    // Use RESTful NestJS endpoint for transactions
instance.get("/transactions", { params }).then(res => setTransactions(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterUser, filterType, filterStatus, filterDate, searchText]);

  useEffect(() => {
    instance.get("/users?limit=1000").then(res => {
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setUsers(arr.map((u: any) => ({ user_id: u.user_id || u._id, name: `${u.lastname} ${u.name}` })));
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      // Use RESTful NestJS endpoint for transactions
await instance.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      message.error("O'chirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80, ellipsis: true },
    { title: "Sana", dataIndex: "createdAt", key: "createdAt", render: (v: string) => v ? new Date(v).toLocaleString() : "-" },
    { title: "Kimdan", dataIndex: "source_id", key: "source_id", render: (id: string) => {
      const user = users.find(u => u.user_id === id);
      return user ? user.name : <span style={{color:'#aaa'}}>Noma’lum</span>;
    } },
    { title: "Kimga", dataIndex: "target_id", key: "target_id", render: (id: string) => {
      const user = users.find(u => u.user_id === id);
      return user ? user.name : <span style={{color:'#aaa'}}>Noma’lum</span>;
    } },
    { title: "Summasi", dataIndex: "amount", key: "amount", render: (v:number) => v?.toLocaleString() },
    { title: "Turi", dataIndex: "type", key: "type", filters: [
      { text: "To'lov", value: "PAYMENT" },
      { text: "Qaytarish", value: "REFUND" },
      { text: "Oylik", value: "SALARY" },
      { text: "Boshqa", value: "OTHER" },
    ],
      render: (v:string) => ({
        PAYMENT: "To'lov",
        REFUND: "Qaytarish",
        SALARY: "Oylik",
        OTHER: "Boshqa"
      }[v] || v),
      onFilter: (value, record) => record.type === value
    },
    { title: "Status", dataIndex: "status", key: "status", filters: [
      { text: "Kutilmoqda", value: "PENDING" },
      { text: "Muvaffaqiyatli", value: "SUCCESS" },
      { text: "Bekor qilingan", value: "FAILED" },
    ],
      render: (v:string) => ({
        PENDING: "Kutilmoqda",
        SUCCESS: "Muvaffaqiyatli",
        FAILED: "Bekor qilingan"
      }[v] || v),
      onFilter: (value, record) => record.status === value
    },
    { title: "Izoh", dataIndex: "reason", key: "reason", render: (v:string) => v || <span style={{color:'#aaa'}}>–</span> },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, record: any) => (
        <Button danger size="small" onClick={() => handleDelete(record.id)}>
          O'chirish
        </Button>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Pul o‘tkazmalari</Typography.Title>
        <Button type="primary" onClick={() => setShowAdd(true)}>Pul o'tkazmasi qo'shish</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Select
          showSearch
          allowClear
          placeholder="Foydalanuvchi filtri"
          style={{ minWidth: 180 }}
          value={filterUser}
          onChange={setFilterUser}
          options={users.map(u => ({ value: u.user_id, label: u.name }))}
        />
        <Select
          allowClear
          placeholder="Turi"
          style={{ minWidth: 120 }}
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: "PAYMENT", label: "To'lov" },
            { value: "REFUND", label: "Qaytarish" },
            { value: "SALARY", label: "Oylik" },
            { value: "OTHER", label: "Boshqa" },
          ]}
        />
        <Select
          allowClear
          placeholder="Status"
          style={{ minWidth: 120 }}
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "PENDING", label: "Kutilmoqda" },
            { value: "SUCCESS", label: "Muvaffaqiyatli" },
            { value: "FAILED", label: "Bekor qilingan" },
          ]}
        />
        <DatePicker
          placeholder="Sana"
          onChange={d => setFilterDate(d ? dayjs(d).format("YYYY-MM-DD") : undefined)}
          value={filterDate ? dayjs(filterDate) : undefined}
          allowClear
        />
        <Input
          placeholder="Qidiruv..."
          style={{ minWidth: 140 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={fetchTransactions}
        />
        <Button onClick={() => { setFilterUser(undefined); setFilterType(undefined); setFilterStatus(undefined); setFilterDate(undefined); setSearchText(""); fetchTransactions(); }}>Tozalash</Button>
      </div>
      <Spin spinning={loading}>
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey={r => r.id}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: loading ? 'Yuklanmoqda...' : 'Transactionlar topilmadi' }}
        />
      </Spin>
      <AddTransactionModal open={showAdd} onClose={() => setShowAdd(false)} onSuccess={fetchTransactions} />
    </div>
  );
};

export default Payments;

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
import Transactions from "./Transactions";
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
      <Tabs
        defaultActiveKey="student"
        type="card"
        items={[
          {
            key: "student",
            label: "O‘quvchi to‘lovlari",
            children: (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <button className={styles.addPaymentBtn} onClick={() => setShowAdd(true)}>+ To‘lov qo‘shish</button>
                  <div className={styles.filterBar}>{filterBar}</div>
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
            ),
          },
          {
            key: "teacher",
            label: "O‘qituvchiga oylik",
            children: <TeacherPayments teacherId={user?.role === 'teacher' ? user.user_id || user.id || user._id : ''} isAdmin={user?.role === 'admin'} />, // only own salary
          },
          {
            key: "debtors",
            label: "Qarzdorlar",
            children: <Debtors />, // o'z komponenti
          },
          {
            key: "discounts",
            label: "Chegirmalar",
            children: <Discounts />, // o'z komponenti
          },
          {
            key: "transactions",
            label: "Transactionlar",
            children: <Transactions />, // o'z komponenti
          },
        ]}
      />
    </div>
  );
};

export default Payments;

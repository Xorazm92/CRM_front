import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
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
  const [filterStudent, setFilterStudent] = useState<number | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterDate, setFilterDate] = useState<string | undefined>();
  const [searchText, setSearchText] = useState<string>("");

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
      if (!Array.isArray(data)) {
        data = Array.isArray(data.results) ? data.results : [];
      }
      setPayments(data);
    } catch (err) {
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
        onChange={v => setFilterStudent(Number(v))}
        value={filterStudent}
        options={[
          // Assuming students is an array of objects with id and name properties
          // Replace with actual data
          { value: 1, label: 'Student 1' },
          { value: 2, label: 'Student 2' },
        ]}
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

  return (
    <div className="payments-page">
      <Tabs defaultActiveKey="student" type="card" items={[
        {
          key: "student",
          label: "O‘quvchi to‘lovlari",
          children: <StudentPayments studentId="" />,
        },
        {
          key: "teacher",
          label: "O‘qituvchiga oylik",
          children: <TeacherPayments teacherId="" isAdmin={true} />,
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
          label: "Transactionlar",
          children: <Transactions />,
        },
      ]} />
    </div>
  );
};

export default Payments;

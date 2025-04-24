// Converted from TeacherPayments.jsx to TeacherPayments.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import AddTeacherSalaryModal from "./AddTeacherSalaryModal";

interface TeacherPaymentsProps {
  teacherId: string;
  isAdmin?: boolean;
}

interface SalaryType {
  id: string;
  date: string;
  amount: number;
  status: string;
  paid_date?: string;
}

const TeacherPayments: React.FC<TeacherPaymentsProps> = ({ teacherId, isAdmin }) => {
  const [salaries, setSalaries] = useState<SalaryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchSalaries = () => {
    setLoading(true);
    fetch(`/api/v1/payment/salary/history/${teacherId}`)
      .then(res => res.json())
      .then(data => setSalaries(Array.isArray(data) ? data : []))
      .catch(() => setError("Oyliklarni olishda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSalaries();
    // eslint-disable-next-line
  }, [teacherId]);

  const downloadReceipt = (salaryId: string) => {
    window.open(`/api/v1/payment/${salaryId}/receipt`, '_blank');
  };

  const columns = [
    { title: 'Sana', dataIndex: 'date', key: 'date' },
    { title: 'Oylik summasi', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'To‘langan sana', dataIndex: 'paid_date', key: 'paid_date' },
    {
      title: 'Chek',
      key: 'receipt',
      render: (_: any, record: SalaryType) => (
        <Button size="small" onClick={() => downloadReceipt(record.id)}>PDF</Button>
      )
    }
  ];

  return (
    <div>
      <h2>Oyliklar tarixi</h2>
      {isAdmin && <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: 16 }}>Yangi oylik hisoblash</Button>}
      {loading ? <Spin /> : error ? <div className="text-red-600 font-semibold">{error}</div> : (
        <Table
          dataSource={salaries}
          columns={columns}
          rowKey={record => record.id}
          pagination={false}
        />
      )}
      <AddTeacherSalaryModal
        teacherId={teacherId}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchSalaries();
          message.success("Oylik muvaffaqiyatli hisoblandi!");
        }}
      />
    </div>
  );
};

export default TeacherPayments;

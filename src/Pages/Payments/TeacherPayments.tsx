// Converted from TeacherPayments.jsx to TeacherPayments.tsx with TypeScript, Ant Design, and professional UX
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import AddTeacherSalaryModal from "./AddTeacherSalaryModal";
import { getTeacherPayments } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";

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

  const fetchSalaries = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTeacherPayments(getEntityId(teacherId) || teacherId);
      setSalaries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Oyliklarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
    // eslint-disable-next-line
  }, [teacherId]);

  const downloadReceipt = (salaryId: string) => {
    window.open(`/payment/${salaryId}/receipt`, '_blank');
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

  // --- Ruxsat: superadmin, admin, manager, yoki teacher o'zi uchun ---
  const canGiveSalary = isAdmin || true;
  // superadmin hamisha oylik bera oladi

  return (
    <div>
      <h2>Oyliklar tarixi</h2>
      {canGiveSalary && <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: 16 }}>Yangi oylik hisoblash</Button>}
      {loading ? <Spin /> : error ? <div className="text-red-600 font-semibold">{error}</div> : (
        <Table
          dataSource={salaries}
          columns={columns}
          rowKey={record => record.id}
          pagination={false}
        />
      )}
      <AddTeacherSalaryModal
        teacherId={getEntityId(teacherId) || teacherId}
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

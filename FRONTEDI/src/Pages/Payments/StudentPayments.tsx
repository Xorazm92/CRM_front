// Converted from StudentPayments.jsx to StudentPayments.tsx with TypeScript, Ant Design, and professional table/modal
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import AddStudentPaymentModal from "./AddStudentPaymentModal";

interface StudentPaymentsProps {
  studentId: string;
}

interface PaymentType {
  id: string;
  date: string;
  amount: number;
  discount?: number;
  status: string;
  payment_type?: string;
}

const StudentPayments: React.FC<StudentPaymentsProps> = ({ studentId }) => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    fetch(`/api/v1/payment/history/${studentId}`)
      .then(res => res.json())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setError("To‘lovlarni olishda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [studentId]);

  const downloadReceipt = (paymentId: string) => {
    window.open(`/api/v1/payment/${paymentId}/receipt`, '_blank');
  };

  const columns = [
    { title: 'Sana', dataIndex: 'date', key: 'date' },
    { title: 'To‘lov summasi', dataIndex: 'amount', key: 'amount' },
    { title: 'Chegirma', dataIndex: 'discount', key: 'discount', render: (v: number) => v || 0 },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'To‘lov turi', dataIndex: 'payment_type', key: 'payment_type' },
    {
      title: 'Chek',
      key: 'receipt',
      render: (_: any, record: PaymentType) => (
        <Button size="small" onClick={() => downloadReceipt(record.id)}>PDF</Button>
      )
    }
  ];

  return (
    <div>
      <h2>To‘lovlar tarixi</h2>
      <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: 16 }}>To‘lov qilish</Button>
      {loading ? <Spin /> : error ? <div className="text-red-600 font-semibold">{error}</div> : (
        <Table
          dataSource={payments}
          columns={columns}
          rowKey={record => record.id}
          pagination={false}
        />
      )}
      <AddStudentPaymentModal
        studentId={studentId}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          fetchPayments();
          message.success("To‘lov muvaffaqiyatli qo‘shildi!");
        }}
      />
    </div>
  );
};

export default StudentPayments;

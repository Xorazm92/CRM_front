// Converted from StudentPayments.jsx to StudentPayments.tsx with TypeScript, Ant Design, and professional table/modal
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import AddStudentPaymentModal from "./AddStudentPaymentModal";
import { getStudentPayments } from "../../api/payments";
import { getEntityId } from "../../utils/getEntityId";

interface StudentPaymentsProps {
  studentId: string;
}

interface PaymentType {
  id: string;
  createdAt: string;
  amount: number;
  type: string;
  description: string;
}

const StudentPayments: React.FC<StudentPaymentsProps> = ({ studentId }) => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      // TO'G'RI: studentId majburiy, endpoint: payments/student/:id
      const sid = getEntityId(studentId) || studentId;
      if (!sid) {
        setPayments([]);
        setLoading(false);
        return;
      }
      const data = await getStudentPayments(sid);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("To‘lovlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchPayments();
    // eslint-disable-next-line
  }, [studentId]);

  const columns = [
    { title: "Sana", dataIndex: "createdAt", key: "createdAt", render: (v: string) => new Date(v).toLocaleDateString() },
    { title: "Summasi", dataIndex: "amount", key: "amount", render: (v: number) => v || 0 },
    { title: "Turi", dataIndex: "type", key: "type" },
    { title: "Izoh", dataIndex: "description", key: "description" },
    { title: "Harakat", key: "action", render: (_: any, record: any) => (
      <Button size="small" onClick={() => message.info("PDF chiqish hali yo‘q")}>PDF</Button>
    ) }
  ];

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">O‘quvchi to‘lovlari</span>
        <Button type="primary" onClick={() => setShowModal(true)}>+ To‘lov qo‘shish</Button>
      </div>
      {loading ? <Spin /> : error ? <div className="text-red-600 font-semibold">{error}</div> : (
        <Table
          dataSource={payments}
          columns={columns}
          rowKey={record => record.id || record._id}
          pagination={false}
        />
      )}
      <AddStudentPaymentModal
        studentId={getEntityId(studentId) || studentId}
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

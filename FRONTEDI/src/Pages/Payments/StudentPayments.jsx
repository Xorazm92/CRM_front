import React, { useEffect, useState } from "react";

const StudentPayments = ({ studentId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/payment/history/${studentId}`)
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(() => setError("To‘lovlarni olishda xatolik"))
      .finally(() => setLoading(false));
  }, [studentId]);

  const downloadReceipt = (paymentId) => {
    window.open(`/api/v1/payment/${paymentId}/receipt`, '_blank');
  };

  return (
    <div>
      <h2>To‘lovlar tarixi</h2>
      <button onClick={() => setShowModal(true)}>To‘lov qilish</button>
      {loading ? <div>Yuklanmoqda...</div> : error ? <div>{error}</div> : (
        <table>
          <thead>
            <tr>
              <th>Sana</th>
              <th>To‘lov summasi</th>
              <th>Chegirma</th>
              <th>Status</th>
              <th>To‘lov turi</th>
              <th>Chek</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>{p.amount}</td>
                <td>{p.discount}</td>
                <td>{p.status}</td>
                <td>{p.payment_type}</td>
                <td>
                  <button onClick={() => downloadReceipt(p.id)}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && <AddStudentPaymentModal studentId={studentId} onClose={() => setShowModal(false)} onSuccess={() => {
        setShowModal(false);
        setLoading(true);
        fetch(`/api/v1/payment/history/${studentId}`)
          .then(res => res.json())
          .then(data => setPayments(data))
          .catch(() => setError("To‘lovlarni olishda xatolik"))
          .finally(() => setLoading(false));
      }} />}
    </div>
  );
};

export default StudentPayments;

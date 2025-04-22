import React, { useEffect, useState } from "react";

const TeacherPayments = ({ teacherId, isAdmin }) => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/payment/salary/history/${teacherId}`)
      .then(res => res.json())
      .then(data => setSalaries(data))
      .catch(() => setError("Oyliklarni olishda xatolik"))
      .finally(() => setLoading(false));
  }, [teacherId]);

  const downloadReceipt = (salaryId) => {
    window.open(`/api/v1/payment/${salaryId}/receipt`, '_blank');
  };

  return (
    <div>
      <h2>Oyliklar tarixi</h2>
      {isAdmin && <button onClick={() => setShowModal(true)}>Yangi oylik hisoblash</button>}
      {loading ? <div>Yuklanmoqda...</div> : error ? <div>{error}</div> : (
        <table>
          <thead>
            <tr>
              <th>Sana</th>
              <th>Oylik summasi</th>
              <th>Status</th>
              <th>To‘langan sana</th>
              <th>Chek</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td>{s.amount}</td>
                <td>{s.status}</td>
                <td>{s.paid_date}</td>
                <td>
                  <button onClick={() => downloadReceipt(s.id)}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && <AddTeacherSalaryModal teacherId={teacherId} onClose={() => setShowModal(false)} onSuccess={() => {
        setShowModal(false);
        setLoading(true);
        fetch(`/api/v1/payment/salary/history/${teacherId}`)
          .then(res => res.json())
          .then(data => setSalaries(data))
          .catch(() => setError("Oyliklarni olishda xatolik"))
          .finally(() => setLoading(false));
      }} />}
    </div>
  );
};

export default TeacherPayments;

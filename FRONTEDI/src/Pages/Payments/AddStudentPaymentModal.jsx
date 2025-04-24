import React, { useState } from "react";

const AddStudentPaymentModal = ({ studentId, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("naqd");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/payment/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId, // snake_case!
          amount,
          payment_type: paymentType,
          description,
        }),
      });
      if (!res.ok) throw new Error("To‘lovni amalga oshirishda xatolik");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>To‘lov summasi:</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <label>To‘lov turi:</label>
        <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
          <option value="naqd">Naqd</option>
          <option value="karta">Karta</option>
          <option value="onlayn">Onlayn</option>
        </select>
        <label>Izoh:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? "Yuborilmoqda..." : "To‘lov qilish"}</button>
        <button type="button" onClick={onClose}>Bekor qilish</button>
      </form>
    </div>
  );
};

export default AddStudentPaymentModal;

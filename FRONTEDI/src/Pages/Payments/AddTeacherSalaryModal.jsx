import React, { useState } from "react";

const AddTeacherSalaryModal = ({ teacherId, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/payment/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          amount,
          description,
        }),
      });
      if (!res.ok) throw new Error("Oylikni amalga oshirishda xatolik");
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
        <label>Oylik summasi:</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <label>Izoh:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? "Yuborilmoqda..." : "Oylik hisoblash"}</button>
        <button type="button" onClick={onClose}>Bekor qilish</button>
      </form>
    </div>
  );
};

export default AddTeacherSalaryModal;

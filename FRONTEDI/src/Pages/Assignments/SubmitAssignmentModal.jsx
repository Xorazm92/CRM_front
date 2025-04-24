import React, { useState } from "react";
import instance from "../../api/axios";

export default function SubmitAssignmentModal({ open, onClose, assignment, onSuccess }) {
  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open || !assignment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("assignment_id", assignment.assignment_id || assignment.id);
    formData.append("answer_text", answerText);
    if (file) formData.append("file", file);
    try {
      await instance.post("/submissions", formData);
      alert("Vazifa topshirildi!");
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Topshirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Vazifani topshirish</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
            placeholder="Javob matni..."
            rows={4}
            style={{ width: "100%" }}
          />
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
            <button type="submit" disabled={loading}>Topshirish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

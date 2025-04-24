import React, { useState } from "react";
import instance from "../../api/axios";

export default function GradeSubmissionModal({ open, onClose, submission, onSuccess }) {
  const [grade, setGrade] = useState(submission?.grade || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [loading, setLoading] = useState(false);

  if (!open || !submission) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.patch(`/submissions/${submission.submission_id || submission.id}`, {
        grade,
        feedback
      });
      alert("Baholash saqlandi!");
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Baholashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Baholash</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Baho</label>
            <input value={grade} onChange={e => setGrade(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} disabled={loading} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Bekor qilish</button>
            <button type="submit" disabled={loading}>Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  );
}

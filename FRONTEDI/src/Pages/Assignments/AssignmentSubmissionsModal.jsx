import React, { useEffect, useState } from "react";
import instance from "../../api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import GradeSubmissionModal from "./GradeSubmissionModal";

export default function AssignmentSubmissionsModal({ open, onClose, assignment }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGrade, setShowGrade] = useState(false);
  const [gradeSubmission, setGradeSubmission] = useState(null);

  useEffect(() => {
    if (!open || !assignment) return;
    setLoading(true);
    instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`)
      .then(res => setSubmissions(res.data || []))
      .finally(() => setLoading(false));
  }, [open, assignment]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Topshiriqlar</h2>
        {loading ? <ClipLoader /> : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Talaba</th>
                <th>Fayl</th>
                <th>Javob</th>
                <th>Baho</th>
                <th>Feedback</th>
                <th>Baholash</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr><td colSpan="7">Topshiriqlar topilmadi</td></tr>
              ) : submissions.map((s, i) => (
                <tr key={s.submission_id || s.id || i}>
                  <td>{i + 1}</td>
                  <td>{s.student?.name || s.student_name || s.student_id}</td>
                  <td>{s.file_path ? <a href={s.file_path} target="_blank" rel="noopener noreferrer">Yuklab olish</a> : '-'}</td>
                  <td>{s.answer_text || '-'}</td>
                  <td>{s.grade || '-'}</td>
                  <td>{s.feedback || '-'}</td>
                  <td>
                    <button onClick={() => { setGradeSubmission(s); setShowGrade(true); }}>Baholash</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-actions">
          <button onClick={onClose}>Yopish</button>
        </div>
      </div>
      <GradeSubmissionModal
        open={showGrade}
        onClose={() => setShowGrade(false)}
        submission={gradeSubmission}
        onSuccess={() => {
          setShowGrade(false);
          // Submissionsni qayta yuklash uchun fetch
          instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`)
            .then(res => setSubmissions(res.data || []));
        }}
      />
    </div>
  );
}

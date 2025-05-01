import { Modal, Table, Input, Button, message } from "antd";
import instance from "../../api/axios";
import { useEffect, useState } from "react";

const AssignmentSubmissionsModal = ({ open, onClose, assignment }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState<{ [id: string]: boolean }>({});
  const [gradeInput, setGradeInput] = useState<{ [id: string]: string }>({});
  const [feedbackInput, setFeedbackInput] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (open && assignment) {
      setLoading(true);
      instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`)
        .then(res => setSubmissions(res.data.data || []))
        .finally(() => setLoading(false));
    }
  }, [open, assignment]);

  const handleGrade = async (submission: any) => {
    setGrading(g => ({ ...g, [submission.submission_id]: true }));
    try {
      await instance.put(`/submissions/${submission.submission_id}`, {
        grade: gradeInput[submission.submission_id],
        feedback: feedbackInput[submission.submission_id]
      });
      message.success("Baholandi");
      // Refresh submissions
      const res = await instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`);
      setSubmissions(res.data.data || []);
    } catch {
      message.error("Baholashda xatolik");
    } finally {
      setGrading(g => ({ ...g, [submission.submission_id]: false }));
    }
  };

  const columns = [
    { title: "#", render: (_: any, __: any, i: number) => i + 1 },
    { title: "O‘quvchi", render: (_: any, r: any) => r.student?.name + ' ' + (r.student?.lastname || '') },
    { title: "Fayl", render: (_: any, r: any) => r.file_path ? <a href={r.file_path} target="_blank" rel="noopener noreferrer">Yuklab olish</a> : '-' },
    { title: "Javob matni", dataIndex: "answer_text" },
    { title: "Ball", render: (_: any, r: any) => (
      <Input
        style={{ width: 70 }}
        value={gradeInput[r.submission_id] ?? r.grade ?? ''}
        onChange={e => setGradeInput(g => ({ ...g, [r.submission_id]: e.target.value }))}
        placeholder="Ball"
        disabled={grading[r.submission_id]}
      />
    ) },
    { title: "Feedback", render: (_: any, r: any) => (
      <Input
        value={feedbackInput[r.submission_id] ?? r.feedback ?? ''}
        onChange={e => setFeedbackInput(f => ({ ...f, [r.submission_id]: e.target.value }))}
        placeholder="Izoh"
        disabled={grading[r.submission_id]}
      />
    ) },
    {
      title: "Baholash",
      render: (_: any, r: any) => (
        <Button
          type="primary"
          loading={grading[r.submission_id]}
          onClick={() => handleGrade(r)}
          disabled={!gradeInput[r.submission_id]}
        >
          Saqlash
        </Button>
      )
    }
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={900} title="Topshiriq natijalari" destroyOnClose>
      <Table
        dataSource={submissions}
        columns={columns}
        rowKey={r => r.submission_id}
        loading={loading}
        pagination={false}
      />
    </Modal>
  );
};

export default AssignmentSubmissionsModal;

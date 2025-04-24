import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Spin, message } from "antd";
import instance from "../../api/axios";
import GradeSubmissionModal from "./GradeSubmissionModal";

interface AssignmentSubmissionsModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
}

const AssignmentSubmissionsModal: React.FC<AssignmentSubmissionsModalProps> = ({ open, onClose, assignment }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGrade, setShowGrade] = useState(false);
  const [gradeSubmission, setGradeSubmission] = useState<any>(null);

  useEffect(() => {
    if (!open || !assignment) return;
    setLoading(true);
    instance.get(`/submissions/assignment/${assignment.assignment_id || assignment.id}`)
      .then(res => setSubmissions(res.data || []))
      .catch(() => message.error("Topshiriqlarni olishda xatolik"))
      .finally(() => setLoading(false));
  }, [open, assignment]);

  const columns = [
    { title: '#', key: 'index', render: (_: any, __: any, idx: number) => idx + 1 },
    { title: 'Talaba', dataIndex: ['student', 'name'], key: 'student', render: (_: any, record: any) => record.student?.name || record.student_name || record.student_id },
    { title: 'Fayl', dataIndex: 'file_path', key: 'file', render: (file: string) => file ? <a href={file} target="_blank" rel="noopener noreferrer">Yuklab olish</a> : '-' },
    { title: 'Javob', dataIndex: 'answer_text', key: 'answer', render: (text: string) => text || '-' },
    { title: 'Baho', dataIndex: 'grade', key: 'grade', render: (grade: string) => grade || '-' },
    { title: 'Feedback', dataIndex: 'feedback', key: 'feedback', render: (feedback: string) => feedback || '-' },
    {
      title: 'Baholash',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => { setGradeSubmission(record); setShowGrade(true); }}>Baholash</Button>
      ),
    },
  ];

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Topshiriqlar" width={900} destroyOnClose>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={submissions}
          pagination={false}
          rowKey={record => String(record.submission_id || record.id)}
        />
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Yopish</Button>
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
      </Spin>
    </Modal>
  );
};

export default AssignmentSubmissionsModal;

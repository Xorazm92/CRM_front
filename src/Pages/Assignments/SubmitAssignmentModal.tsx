import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../api/axios";
import { useState } from "react";
import { useAuthStore } from '../../store/useAuthStore';

interface SubmitAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ open, onClose, assignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // assignment_id va student_id majburiy va UUID bo'lishi kerak
      console.log("assignment object:", assignment);
      const assignment_id = assignment.assignment_id;
      const user = useAuthStore.getState().user;
      const student_id = String(user?.student_id || user?.user_id || user?.id);

      if (!assignment_id || typeof assignment_id !== 'string') {
        message.error("assignment_id topilmadi yoki noto'g'ri! Modal assignment propni tekshiring.");
        setLoading(false);
        return;
      }
      // Debug: assignment_id va student_id
      console.log("assignment_id (type):", typeof assignment_id, assignment_id);
      console.log("student_id (type):", typeof student_id, student_id);

      // FormData'ga faqat string va File/Blob qo'shish
      formData.append("assignment_id", assignment_id);
      formData.append("student_id", student_id);

      // UUID formatini tekshirish
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(String(assignment_id)) || !uuidRegex.test(String(student_id))) {
        message.error("assignment_id yoki student_id noto'g'ri formatda!");
        setLoading(false);
        return;
      }

      formData.append("assignment_id", String(assignment_id));
      formData.append("student_id", String(student_id));

      // Javob matni yoki fayl bo'lishi shart (kamida biri)
      if (!values.answer_text && fileList.length === 0) {
        message.error("Javob matni yoki fayl yuklang!");
        setLoading(false);
        return;
      }

      // --- FAYL BOR: FormData bilan yuborish ---
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("assignment_id", assignment_id);
        formData.append("student_id", student_id);
        if (values.answer_text) formData.append("answer_text", String(values.answer_text));
        const fileObj = fileList[0].originFileObj || fileList[0];
        formData.append("file", fileObj);
        // Debug: FormData tarkibi
        for (let [key, value] of (formData as any).entries()) {
          console.log(key, value);
        }
        await instance.post("/submissions", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // --- FAYL YO‘Q: JSON bilan yuborish ---
        const payload = {
          assignment_id,
          student_id,
          answer_text: values.answer_text || ""
        };
        console.log("JSON payload:", payload);
        await instance.post("/submissions", payload, {
          headers: { "Content-Type": "application/json" }
        });
      }
      message.success("Topshiriq muvaffaqiyatli yuborildi");
      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Yuborishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !assignment) return null;

  return (
    <Modal open={open} onCancel={onClose} title="Topshiriqni topshirish" footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="answer_text" label="Javob matni">
          <Input.TextArea rows={3} placeholder="Javobingizni kiriting yoki fayl yuklang" />
        </Form.Item>
        <Form.Item name="file" label="Fayl">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            maxCount={1}
            onChange={({ fileList }) => setFileList(fileList)}
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Yuborish</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubmitAssignmentModal;

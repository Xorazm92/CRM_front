import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../api/axios";

const EditAssignmentModal = ({ open, onClose, assignment, onSuccess }) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setInitLoading(true);
      Promise.all([
        instance.get("/groups"),
        instance.get("/lessons")
      ]).then(([gRes, lRes]) => {
        setGroups(gRes.data.data || []);
        setLessons(lRes.data.data || []);
      }).finally(() => setInitLoading(false));
      if (assignment) {
        form.setFieldsValue({
          ...assignment,
          group_id: assignment.group?.group_id || assignment.group_id || assignment.group?.id,
          lesson_id: assignment.lesson?.lesson_id || assignment.lesson_id || assignment.lesson?.id,
          due_date: assignment.due_date ? (assignment.due_date instanceof Date ? assignment.due_date : assignment.due_date && window.moment ? window.moment(assignment.due_date) : assignment.due_date) : null
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, assignment]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (key === "file" && val?.file) {
          formData.append("file", val.file.originFileObj);
        } else {
          formData.append(key, val);
        }
      });
      await instance.put(`/assignments/${assignment.assignment_id || assignment.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      message.success("Topshiriq yangilandi");
      onSuccess && onSuccess();
      onClose();
    } catch {
      message.error("Yangilashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} title="Topshiriqni tahrirlash" footer={null} destroyOnClose>
      <Spin spinning={initLoading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Sarlavha" rules={[{ required: true, message: "Sarlavha majburiy" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Tavsif"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh majburiy" }]}> <Select options={groups.map(g => ({ value: g.group_id || g.id, label: g.name }))} /> </Form.Item>
          <Form.Item name="lesson_id" label="Dars" rules={[{ required: true, message: "Dars majburiy" }]}> <Select options={lessons.map(l => ({ value: l.lesson_id || l.id, label: l.topic }))} /> </Form.Item>
          <Form.Item name="due_date" label="Deadline" rules={[{ required: true, message: "Deadline majburiy" }]}> <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="file" label="Fayl"> <Upload beforeUpload={() => false} maxCount={1}> <Button icon={<UploadOutlined />}>Fayl yuklash</Button> </Upload> </Form.Item>
          <Form.Item> <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button> <Button onClick={onClose} style={{ marginLeft: 8 }}>Bekor qilish</Button> </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditAssignmentModal;

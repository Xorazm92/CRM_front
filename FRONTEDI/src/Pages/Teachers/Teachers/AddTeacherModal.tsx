// Zamonaviy, professional va type-safe AddTeacherModal.tsx (Ant Design, TypeScript, backend integration)
import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message, Upload } from "antd";
import instance from "../../../api/axios";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherAdded: () => void;
}

interface AddTeacherForm {
  name: string;
  lastname: string;
  middlename?: string;
  birthdate: any;
  gender: string;
  address?: string;
  phone_number: string;
  specialization?: string;
  experience?: string;
  education?: string;
  salary_type?: string;
  salary_date?: any;
  salary?: string;
  avatar?: any;
}

const genderOptions = [
  { value: "MALE", label: "O‘g‘il bola" },
  { value: "FEMALE", label: "Qiz bola" },
];
const salaryTypeOptions = [
  { value: "Soatbay", label: "Soatbay" },
  { value: "Oylik", label: "Oylik" },
];
const experienceOptions = [
  { value: "1 yil", label: "1 yil" },
  { value: "2 yil", label: "2 yil" },
  { value: "3 yil", label: "3 yil" },
  { value: "5+ yil", label: "5+ yil" },
];
const educationOptions = [
  { value: "O‘rta", label: "O‘rta" },
  { value: "Oliy", label: "Oliy" },
];
const specializationOptions = [
  { value: "Fan yoki kurs", label: "Fan yoki kurs" },
];

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onTeacherAdded }) => {
  const [form] = Form.useForm<AddTeacherForm>();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>(null);

  const handleFinish = async (values: AddTeacherForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "birthdate" || key === "salary_date") {
          if (value) formData.append(key, value.format("YYYY-MM-DD"));
        } else if (key === "avatar") {
          if (avatar) formData.append("avatar", avatar);
        } else if (value) {
          formData.append(key, value);
        }
      });
      formData.append("role", "TEACHER");
      await instance.post("/api/v1/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("O‘qituvchi muvaffaqiyatli qo‘shildi!");
      form.resetFields();
      setAvatar(null);
      onTeacherAdded();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || "Qo‘shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setAvatar(info.file.originFileObj);
      form.setFieldsValue({ avatar: info.file.originFileObj });
    }
  };

  return (
    <Modal
      open={isOpen}
      title="Yangi o‘qituvchi qo‘shish"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: '', salary_type: '', education: '', experience: '' }}
      >
        <Form.Item label="Ism" name="name" rules={[{ required: true, message: "Ismi majburiy!" }]}> <Input placeholder="Ism" /> </Form.Item>
        <Form.Item label="Familiya" name="lastname" rules={[{ required: true, message: "Familiyasi majburiy!" }]}> <Input placeholder="Familiya" /> </Form.Item>
        <Form.Item label="Sharif" name="middlename"> <Input placeholder="Sharif" /> </Form.Item>
        <Form.Item label="Tug‘ilgan sana" name="birthdate" rules={[{ required: true, message: "Tug‘ilgan sana majburiy!" }]}> <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" /> </Form.Item>
        <Form.Item label="Jinsi" name="gender" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsini tanlang" options={genderOptions} /> </Form.Item>
        <Form.Item label="Yashash manzili" name="address"> <Input placeholder="Yashash manzili" /> </Form.Item>
        <Form.Item label="Telefon raqami" name="phone_number" rules={[{ required: true, message: "Telefon raqam majburiy!" }, { pattern: /^\+?\d{9,15}$/, message: "Telefon raqam noto‘g‘ri!" }]}> <Input placeholder="Telefon raqam" /> </Form.Item>
        <Form.Item label="Mutaxassisligi" name="specialization"> <Select placeholder="Mutaxassisligi" options={specializationOptions} /> </Form.Item>
        <Form.Item label="Tajribasi" name="experience"> <Select placeholder="Tajribasi" options={experienceOptions} /> </Form.Item>
        <Form.Item label="Ma’lumoti" name="education"> <Select placeholder="Ma’lumoti" options={educationOptions} /> </Form.Item>
        <Form.Item label="Maosh turi" name="salary_type"> <Select placeholder="Maosh turi" options={salaryTypeOptions} /> </Form.Item>
        <Form.Item label="Maosh sanasi" name="salary_date"> <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" /> </Form.Item>
        <Form.Item label="Maoshi" name="salary"> <Input placeholder="Maoshi" /> </Form.Item>
        <Form.Item label="Rasm" name="avatar" valuePropName="fileList" getValueFromEvent={() => avatar ? [avatar] : []}>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            {avatar && <span style={{ marginLeft: 8, color: '#1890ff' }}>{avatar.name}</span>}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>Qo‘shish</Button>
          <Button onClick={onClose} disabled={loading}>Bekor qilish</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherModal;

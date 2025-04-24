// Zamonaviy, professional va backendga to‘g‘ri integratsiyalashgan AddStudent.tsx
import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Spin, Card } from "antd";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import instance from "../../../api/axios";
import dayjs from "dayjs";

interface AddStudentForm {
  username: string;
  name: string;
  lastname: string;
  middlename: string;
  birthdate: any;
  address: string;
  payment: string;
  phone_number: string;
  gender: string;
  password: string;
}

const AddStudent: React.FC = () => {
  const [form] = Form.useForm<AddStudentForm>();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: AddStudentForm) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format("YYYY-MM-DD") : undefined,
        role: "student"
      };
      await instance.post("/student/createStudent", payload);
      message.success("O'quvchi muvaffaqiyatli qo'shildi!");
      form.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>O’quvchi qo’shish</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: '', address: '', payment: '', phone_number: '', lastname: '', middlename: '' }}
      >
        <Form.Item label="Foydalanuvchi nomi" name="username" rules={[{ required: true, message: "Foydalanuvchi nomi majburiy!" }]}> <Input placeholder="Masalan: bari.fari" /> </Form.Item>
        <Form.Item label="Ism" name="name" rules={[{ required: true, message: "Ism majburiy!" }]}> <Input placeholder="Shokirjon" /> </Form.Item>
        <Form.Item label="Familiya" name="lastname" rules={[{ required: true, message: "Familiya majburiy!" }]}> <Input placeholder="Sultonov" /> </Form.Item>
        <Form.Item label="Sharifi" name="middlename"> <Input placeholder="Tursinjon o’gli" /> </Form.Item>
        <Form.Item label="Tug‘ilgan sana" name="birthdate" rules={[{ required: true, message: "Tug‘ilgan sana majburiy!" }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
        <Form.Item label="Jinsi" name="gender" rules={[{ required: true, message: "Jinsi majburiy!" }]}> <Select placeholder="Jinsini tanlang"> <Select.Option value="male">O'g'il bola</Select.Option> <Select.Option value="female">Qiz bola</Select.Option> </Select> </Form.Item>
        <Form.Item label="Parol" name="password" rules={[{ required: true, message: "Parol majburiy!" }]}> <Input.Password placeholder="Parol kiriting" /> </Form.Item>
        <Form.Item label="Yashash manzili" name="address"> <Input placeholder="Toshkent, Guliston" /> </Form.Item>
        <Form.Item label="To’lov summa" name="payment"> <Input placeholder="500 000 so’m" /> </Form.Item>
        <Form.Item label="Ota-Onasini tel raqami" name="phone_number"> <Input placeholder="+998 (93) 123-45-67" /> </Form.Item>
        <Form.Item label="Rasm"> <ImageUpload /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>Saqlash</Button>
          <Button onClick={() => form.resetFields()} disabled={loading}>Bekor qilish</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddStudent;

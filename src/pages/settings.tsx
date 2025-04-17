// Sozlamalar sahifasi: foydalanuvchi parolini o'zgartirish uchun forma
import { Card, Form, Input, Button, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/profile';

const Settings = () => {
  const [form] = Form.useForm(); // Formani boshqarish uchun hook
  // Parolni o'zgartirish uchun mutation
  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success("Parol muvaffaqiyatli o'zgartirildi!");
      form.resetFields(); // Formani tozalash
    },
    onError: (error: any) => {
      message.error(error?.message || "Xatolik yuz berdi!");
    }
  });

  // Formani topshirishda (submit) ishlaydi
  const onFinish = (values: any) => {
    // Parollar mosligini tekshirish (asosiy tekshiruv validatorda)
    mutation.mutate(values);
  };

  return (
    <Card title="Sozlamalar" style={{ maxWidth: 500, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* Joriy parol maydoni */}
        <Form.Item name="oldPassword" label="Joriy parol" rules={[{ required: true, message: "Joriy parolni kiriting" }]}> 
          <Input.Password />
        </Form.Item>
        {/* Yangi parol maydoni */}
        <Form.Item name="newPassword" label="Yangi parol" rules={[{ required: true, min: 6, message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" }]}> 
          <Input.Password />
        </Form.Item>
        {/* Yangi parolni tasdiqlash maydoni */}
        <Form.Item
          name="confirmPassword"
          label="Yangi parolni tasdiqlang"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Yangi parolni tasdiqlang" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Parollar mos emas!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* Submit tugmasi */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
            Parolni o'zgartirish
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Settings;

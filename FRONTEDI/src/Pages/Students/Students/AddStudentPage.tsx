import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import instance from "../../../api/axios";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import { createStudent, addStudentToGroup } from "../../../api/users";

interface GroupType {
  group_id?: string;
  _id?: string;
  id?: string;
  name?: string;
}

const AddStudentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    instance.get('/groups').then(res => {
      const data = res.data;
      if (Array.isArray(data)) setGroups(data);
      else if (Array.isArray(data.data)) setGroups(data.data);
      else if (Array.isArray(data.results)) setGroups(data.results);
      else setGroups([]);
    }).finally(() => setLoading(false));
  }, []);

  const handleFinish = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const genderEnum = values.gender === 'male' ? 'MALE' : 'FEMALE';
      // 1. Student yaratish
      const userRes = await createStudent({
        name: values.name,
        lastname: values.lastname,
        middlename: values.middlename,
        birthdate: values.birthDate ? values.birthDate.toISOString() : undefined,
        gender: genderEnum,
        address: values.address,
        phone_number: values.phone_number,
        username: values.username,
        password: values.password
      });
      const user_id = userRes.user_id || userRes.id || userRes._id;
      // 2. Studentni guruhga biriktirish
      if (user_id && values.group_id) {
        await addStudentToGroup(values.group_id, user_id);
      }
      message.success("O‘quvchi muvaffaqiyatli qo‘shildi!");
      form.resetFields();
      navigate("/students");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:'0 24px', maxWidth: '100%', margin: '0 auto'}}>
      <h2 style={{fontWeight:700, fontSize:22, margin:'32px 0 24px'}}>O‘quvchilarni qo‘shish</h2>
      <div style={{display:'flex',gap:32,alignItems:'flex-start'}}>
        {/* Chap ustun: Rasm */}
        <div style={{width:220}}>
          <Form.Item label="Rasm" name="image" style={{marginBottom:24}}>
            <ImageUpload onChange={setImage} />
          </Form.Item>
        </div>
        {/* O‘ng ustun: Forma va maydonlar */}
        <div style={{flex:1}}>
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
              <Form.Item name="username" label="Foydalanuvchi nomi" rules={[{ required: true, message: "Foydalanuvchi nomi majburiy!" }]}> 
                <Input placeholder="masalan: shokirjon.sultonov" />
              </Form.Item>
              <Form.Item name="password" label="Parol" rules={[{ required: true, message: "Parol majburiy!" }]}> 
                <Input.Password placeholder="Parol kiriting" />
              </Form.Item>
              <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy!" }]}> 
                <Input placeholder="Shokirjon" />
              </Form.Item>
              <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy!" }]}> 
                <Input placeholder="Sultonov" />
              </Form.Item>
              <Form.Item name="middlename" label="Sharfi"> 
                <Input placeholder="Tursinjon o‘gli" />
              </Form.Item>
              <Form.Item name="birthDate" label="Tug‘ilgan sana" rules={[{ required: true, message: "Tug‘ilgan sana majburiy!" }]}> 
                <DatePicker className="w-full" format="DD.MM.YYYY" style={{width:'100%'}} />
              </Form.Item>
              <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> 
                <Select placeholder="Jinsi tanlang" options={[{ value: 'male', label: 'O‘g‘il bola' }, { value: 'female', label: 'Qiz bola' }]} />
              </Form.Item>
              <Form.Item name="address" label="Yashash manzili"> 
                <Input placeholder="Toshkent, Guliston" />
              </Form.Item>
              <Form.Item name="group_id" label="Guruh raqami" rules={[{ required: true, message: "Guruh majburiy!" }]}> 
                <Select placeholder="Guruh tanlang" options={groups.map(g => ({ value: g.group_id || g._id || g.id, label: g.name }))} />
              </Form.Item>
              <Form.Item name="payment_type" label="To‘lov"> 
                <Select placeholder="To‘lov turi tanlang" options={[{value:'naqd',label:'Naqd'},{value:'karta',label:'Karta'},{value:'onlayn',label:'Onlayn'}]} />
              </Form.Item>
              <Form.Item name="payment_amount" label="To‘lov summa"> 
                <Input placeholder="500 000 so‘m" />
              </Form.Item>
              <Form.Item name="phone_number" label="Ota-Onasini tel raqami"> 
                <Input placeholder="+998 (93) 123-45-67" />
              </Form.Item>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:24}}>
              <Button onClick={() => navigate("/students")} danger>Bekor qilish</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
            </div>
          </Form>
        </div>
        {/* O‘ng chetda: Kalendar (davomat) */}
        <div style={{minWidth:260}}>
          <Card style={{padding:0}}>
            <div style={{fontWeight:600,marginBottom:8}}>Davomat</div>
            <DatePicker picker="month" style={{width:'100%'}} />
            {/* Bu joyda custom attendance calendar bo‘lishi mumkin */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;

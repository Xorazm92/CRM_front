// Converted from Teachers/EditTeacherModal.jsx to Teachers/EditTeacherModal.tsx with TypeScript support
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin, Upload, Card, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../../api/axios";
import dayjs from "dayjs";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: any;
  onTeacherEdited?: () => void;
}

const { Option } = Select;

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ isOpen, onClose, teacher, onTeacherEdited }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (teacher && isOpen) {
      form.setFieldsValue({
        name: teacher.name || "",
        lastname: teacher.lastname || "",
        middlename: teacher.middlename || "",
        birthDate: teacher.birthDate ? dayjs(teacher.birthDate) : undefined,
        gender: teacher.gender || "O'g'il bola",
        address: teacher.address || "",
        phone_number: teacher.phone_number || teacher.contact || "",
        specialty: teacher.specialty || "",
        experience: teacher.experience || "",
        education: teacher.education || "",
        salaryType: teacher.salaryType || "",
        salaryDate: teacher.salaryDate ? dayjs(teacher.salaryDate) : undefined,
        salary: teacher.salary || "",
      });
      setImageUrl(teacher.photo || null);
    }
  }, [teacher, isOpen, form]);

  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = e => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          if (key === "birthDate" || key === "salaryDate") {
            formData.append(key, value.format("YYYY-MM-DD"));
          } else {
            formData.append(key, value);
          }
        }
      });
      if (imageUrl && typeof imageUrl !== "string") {
        formData.append("photo", imageUrl);
      }
      formData.append("role", "TEACHER");
      await instance.put(`/users/${teacher.user_id || teacher.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("O'qituvchi yangilandi!");
      onTeacherEdited && onTeacherEdited();
      onClose();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O'qituvchini tahrirlash" destroyOnClose width={900}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={24}>
            <Col span={6}>
              <Card>
                <Form.Item label="Rasm" name="photo">
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleImageChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                    ) : (
                      <Button icon={<UploadOutlined />}>Rasmni yuklash</Button>
                    )}
                  </Upload>
                </Form.Item>
              </Card>
            </Col>
            <Col span={18}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy!" }]}> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy!" }]}> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="middlename" label="Sharfi"> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="birthDate" label="Tug‘ilgan sana" rules={[{ required: true, message: "Sana majburiy!" }]}> <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="gender" label="Jinsi" rules={[{ required: true }]}> <Select> <Option value="O'g'il bola">O'g'il bola</Option> <Option value="Qiz bola">Qiz bola</Option> </Select> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="address" label="Yashash manzili"> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="phone_number" label="Tel raqami" rules={[{ required: true, message: "Telefon raqam majburiy!" }]}> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="specialty" label="Mutaxassisligi"> <Input /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="experience" label="Tajriba"> <Select> <Option value="1 yil">1 yil</Option> <Option value="3 yil">3 yil</Option> <Option value="5 yil">5 yil</Option> </Select> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="education" label="Malumoti"> <Select> <Option value="O'rta">O'rta</Option> <Option value="Oliy">Oliy</Option> </Select> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryType" label="Maosh turi"> <Select> <Option value="Soatbay">Soatbay</Option> <Option value="Oylik">Oylik</Option> </Select> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryDate" label="Maosh sanasi"> <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} /> </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salary" label="Maoshi"> <Input /> </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditTeacherModal;

// Improved EditTeacherModal.tsx with better debugging and data handling
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin, Upload, Card, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../../api/axios";
import dayjs from "dayjs";

interface TeacherType {
  user_id?: string;
  id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthDate?: string;
  birthdate?: string; // Alternative property name
  gender?: string;
  address?: string;
  phone_number?: string;
  contact?: string; // Alternative property name
  specialty?: string;
  experience?: string;
  education?: string;
  salaryType?: string;
  salary_type?: string; // Alternative property name
  salaryDate?: string;
  salary_date?: string; // Alternative property name
  salary?: string;
  photo?: string;
  [key: string]: any;
}

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherType | null;
  onTeacherEdited?: () => void;
}

const { Option } = Select;

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ isOpen, onClose, teacher, onTeacherEdited }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);

  // Debug the teacher object when it changes or modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("EditTeacherModal opened with teacher data:", teacher);
    }
  }, [isOpen, teacher]);

  // Set form values when teacher data is available
  useEffect(() => {
    if (teacher && isOpen) {
      console.log("Setting teacher form values for:", teacher);
      
      try {
        // Reset form first
        form.resetFields();
        
        // Gender normalization with better error handling
        let normalizedGender = "";
        if (teacher.gender) {
          if (["MALE", "O'g'il bola", "male"].includes(teacher.gender)) {
            normalizedGender = "O'g'il bola";
          } else if (["FEMALE", "Qiz bola", "female"].includes(teacher.gender)) {
            normalizedGender = "Qiz bola";
          }
        }
        
        // Flexible date mapping with better error handling
        let birthDateValue;
        try {
          birthDateValue = teacher.birthDate 
            ? dayjs(teacher.birthDate) 
            : teacher.birthdate 
              ? dayjs(teacher.birthdate) 
              : undefined;
          
          // Verify date is valid
          if (birthDateValue && !birthDateValue.isValid()) {
            console.warn("Invalid birthdate format:", teacher.birthDate || teacher.birthdate);
            birthDateValue = undefined;
          }
        } catch (err) {
          console.error("Error parsing birthdate:", err);
          birthDateValue = undefined;
        }
        
        let salaryDateValue;
        try {
          salaryDateValue = teacher.salaryDate 
            ? dayjs(teacher.salaryDate) 
            : teacher.salary_date 
              ? dayjs(teacher.salary_date) 
              : undefined;
          
          // Verify date is valid
          if (salaryDateValue && !salaryDateValue.isValid()) {
            console.warn("Invalid salary date format:", teacher.salaryDate || teacher.salary_date);
            salaryDateValue = undefined;
          }
        } catch (err) {
          console.error("Error parsing salary date:", err);
          salaryDateValue = undefined;
        }
        
        // Construct form values
        const formValues = {
          name: teacher.name || "",
          lastname: teacher.lastname || "",
          middlename: teacher.middlename || "",
          birthDate: birthDateValue,
          gender: normalizedGender,
          address: teacher.address || "",
          phone_number: teacher.phone_number || teacher.contact || "",
          specialty: teacher.specialty || "",
          experience: teacher.experience || "",
          education: teacher.education || "",
          salaryType: teacher.salaryType || teacher.salary_type || "",
          salaryDate: salaryDateValue,
          salary: teacher.salary || "",
        };
        
        console.log("Setting form values:", formValues);
        
        // Set form values
        form.setFieldsValue(formValues);
        
        // Set image URL if available
        setImageUrl(teacher.photo || null);
        setFormInitialized(true);
      } catch (err) {
        console.error("Error initializing form:", err);
        message.error("Formani yuklashda xatolik");
      }
    }
  }, [teacher, isOpen, form]);

  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        console.log("Image loaded:", result ? "Image data loaded successfully" : "No image data");
        setImageUrl(result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleFinish = async (values: Record<string, any>) => {
    console.log("Form submit values:", values);
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "birthDate" || key === "salaryDate") {
            const formattedDate = value instanceof dayjs 
              ? value.format("YYYY-MM-DD") 
              : typeof value === 'string' 
                ? value 
                : '';
            console.log(`Formatting ${key}:`, value, "=>", formattedDate);
            formData.append(key, formattedDate);
          } else {
            console.log(`Adding ${key}:`, value);
            formData.append(key, value);
          }
        }
      });
      
      // Handle photo upload
      if (imageUrl && typeof imageUrl !== "string") {
        formData.append("photo", imageUrl);
        console.log("Photo added to form data");
      }
      
      formData.append("role", "TEACHER");
      
      // Log form data for debugging
      console.log("Form data entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const teacherId = teacher?.user_id || teacher?.id;
      console.log("Updating teacher with ID:", teacherId);
      
      if (!teacherId) {
        throw new Error("Teacher ID not found");
      }
      
      await instance.put(`/users/${teacherId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      message.success("O'qituvchi yangilandi!");
      onTeacherEdited && onTeacherEdited();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      open={isOpen} 
      onCancel={onClose} 
      footer={null} 
      title="O'qituvchini tahrirlash" 
      destroyOnClose 
      width={900}
    >
      <Spin spinning={loading}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFinish}
          initialValues={{
            name: teacher?.name || "",
            lastname: teacher?.lastname || "",
            middlename: teacher?.middlename || "",
            gender: teacher?.gender === "MALE" || teacher?.gender === "male" ? "O'g'il bola" :
                   teacher?.gender === "FEMALE" || teacher?.gender === "female" ? "Qiz bola" : "",
            address: teacher?.address || "",
            phone_number: teacher?.phone_number || teacher?.contact || "",
            specialty: teacher?.specialty || "",
            experience: teacher?.experience || "",
            education: teacher?.education || "",
            salaryType: teacher?.salaryType || teacher?.salary_type || "",
            salary: teacher?.salary || "",
          }}
        >
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
                  <Form.Item 
                    name="name" 
                    label="Ism" 
                    rules={[{ required: true, message: "Ism majburiy!" }]}
                  > 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="lastname" 
                    label="Familiya" 
                    rules={[{ required: true, message: "Familiya majburiy!" }]}
                  > 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="middlename" label="Sharfi"> 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="birthDate" 
                    label="Tug'ilgan sana" 
                    rules={[{ required: true, message: "Sana majburiy!" }]}
                  > 
                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="gender" 
                    label="Jinsi" 
                    rules={[{ required: true, message: "Jinsi majburiy!" }]}
                  > 
                    <Select placeholder="Jinsi tanlang">
                      <Option value="O'g'il bola">O'g'il bola</Option>
                      <Option value="Qiz bola">Qiz bola</Option> 
                    </Select> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="address" label="Yashash manzili"> 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    name="phone_number" 
                    label="Tel raqami" 
                    rules={[{ required: true, message: "Telefon raqam majburiy!" }]}
                  > 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="specialty" label="Mutaxassisligi"> 
                    <Input /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="experience" label="Tajriba"> 
                    <Select placeholder="Tajribani tanlang">
                      <Option value="1 yil">1 yil</Option>
                      <Option value="3 yil">3 yil</Option>
                      <Option value="5 yil">5 yil</Option>
                    </Select> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="education" label="Malumoti"> 
                    <Select placeholder="Ma'lumotni tanlang">
                      <Option value="O'rta">O'rta</Option>
                      <Option value="Oliy">Oliy</Option>
                    </Select> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryType" label="Maosh turi"> 
                    <Select placeholder="Maosh turini tanlang">
                      <Option value="Soatbay">Soatbay</Option>
                      <Option value="Oylik">Oylik</Option>
                    </Select> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salaryDate" label="Maosh sanasi"> 
                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} /> 
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="salary" label="Maoshi"> 
                    <Input /> 
                  </Form.Item>
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
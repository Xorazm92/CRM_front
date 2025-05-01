import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from "antd";
import dayjs from "dayjs";
import { updateStudent } from "../../../api/users";
import instance from "../../../api/axios";
import "./EditStudentModal.css";

interface GroupType {
  group_id?: string;
  _id?: string;
  id?: string;
  name?: string;
}

interface StudentType {
  user_id?: string;
  id?: string;
  name?: string;
  lastname?: string;
  middlename?: string;
  birthdate?: string;
  gender?: string;
  address?: string;
  phone_number?: string;
  group_id?: string;
  group?: GroupType;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentType;
  onStudentEdited: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onStudentEdited }) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch groups when modal is opened
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    instance
      .get('/groups')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) setGroups(data);
        else if (Array.isArray(data.data)) setGroups(data.data);
        else if (Array.isArray(data.results)) setGroups(data.results);
        else setGroups([]);
        
        // Log the groups data for debugging
        console.log("Groups data fetched:", data);
      })
      .catch(err => {
        console.error('Groups fetch error:', err);
        setGroups([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Set form fields when student data changes or modal opens
  useEffect(() => {
    if (student && isOpen) {
      console.log("Setting form values for student:", student);
      
      // Normalize gender value
      let normalizedGender = student.gender || '';
      if (student.gender === "MALE") normalizedGender = "male";
      else if (student.gender === "FEMALE") normalizedGender = "female";
      
      // Find correct group ID - checking all possible field names
      const groupId = student.group_id || 
                      (student.group && (student.group.group_id || 
                                        student.group._id || 
                                        student.group.id)) || 
                      '';
      
      // Reset form before setting values to clear any previous data
      form.resetFields();
      
      // Set form values
      const formValues = {
        name: student.name || '',
        lastname: student.lastname || '',
        middlename: student.middlename || '',
        birthdate: student.birthdate ? dayjs(student.birthdate) : undefined,
        gender: normalizedGender,
        address: student.address || '',
        phone_number: student.phone_number || '',
        group_id: groupId
      };
      
      console.log("Setting form with values:", formValues);
      form.setFieldsValue(formValues);
    }
  }, [student, isOpen, form]);

  const handleFinish = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      // Faqat backenddagi haqiqiy id (id yoki _id) yuboriladi
      const studentId = student.user_id || student.id;
      if (!studentId) {
        message.error("Student ID topilmadi! (id yoki _id mavjud emas)");
        setLoading(false);
        return;
      }
      // Gender faqat 'MALE' yoki 'FEMALE' bo'lishi shart
      const backendGender = values.gender === 'male' ? 'MALE' : values.gender === 'female' ? 'FEMALE' : values.gender;
      // birthdate har doim to'liq ISO-8601 formatda yuboriladi
      let isoBirthdate: string | undefined = undefined;
      if (values.birthdate) {
        // Agar string bo'lsa va uzunligi 10 (faqat yyyy-MM-dd) bo'lsa, oxiriga T00:00:00.000Z qo'shamiz
        if (typeof values.birthdate === 'string') {
          if (/^\d{4}-\d{2}-\d{2}$/.test(values.birthdate)) {
            isoBirthdate = values.birthdate + 'T00:00:00.000Z';
          } else {
            isoBirthdate = new Date(values.birthdate).toISOString();
          }
        } else if (values.birthdate.toISOString) {
          isoBirthdate = values.birthdate.toISOString();
        }
      }
      // Faqat bitta updateStudent chaqiruvini qoldiramiz va faqat ISO-8601 format yuboriladi
      const updateData = {
        name: values.name,
        lastname: values.lastname,
        middlename: values.middlename,
        birthdate: isoBirthdate,
        gender: backendGender,
        address: values.address,
        phone_number: values.phone_number,
        group_id: values.group_id
      };
      console.log("Updating student with ID:", studentId, "Data:", updateData);
      await updateStudent(studentId, updateData);
      message.success("O'quvchi muvaffaqiyatli tahrirlandi!");
      onStudentEdited();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      message.error(err?.response?.data?.message || "Tahrirlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} title="O'quvchini tahrirlash">
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{
          name: student?.name || '',
          lastname: student?.lastname || '',
          middlename: student?.middlename || '',
          gender: student?.gender?.toLowerCase() === 'male' || student?.gender === 'MALE' ? 'male' : 
                 student?.gender?.toLowerCase() === 'female' || student?.gender === 'FEMALE' ? 'female' : '',
          address: student?.address || '',
          phone_number: student?.phone_number || '',
        }}>
          <Form.Item name="name" label="Ism" rules={[{ required: true, message: "Ism majburiy!" }]}> 
            <Input /> 
          </Form.Item>
          <Form.Item name="lastname" label="Familiya" rules={[{ required: true, message: "Familiya majburiy!" }]}> 
            <Input /> 
          </Form.Item>
          <Form.Item name="middlename" label="Otasining ismi"> 
            <Input /> 
          </Form.Item>
          <Form.Item name="birthdate" label="Tug'ilgan sana"> 
            <DatePicker className="edit-student-modal-datepicker" format="YYYY-MM-DD" /> 
          </Form.Item>
          <Form.Item name="gender" label="Jinsi" rules={[{ required: true, message: "Jinsi majburiy!" }]}> 
            <Select placeholder="Jinsi tanlang" options={[
              { value: 'male', label: 'Erkak' }, 
              { value: 'female', label: 'Ayol' }
            ]} /> 
          </Form.Item>
          <Form.Item name="address" label="Manzil"> 
            <Input /> 
          </Form.Item>
          <Form.Item name="phone_number" label="Telefon raqam"> 
            <Input /> 
          </Form.Item>
          <Form.Item name="group_id" label="Guruh" rules={[{ required: true, message: "Guruh majburiy!" }]}> 
            <Select 
              placeholder="Guruh tanlang" 
              options={groups.map(g => ({ 
                value: g.group_id || g._id || g.id || '', 
                label: g.name || 'Nomsiz guruh'
              }))} 
            /> 
          </Form.Item>
          <div className="edit-student-modal-footer">
            <Button onClick={onClose}>Bekor qilish</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Saqlash</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditStudentModal;
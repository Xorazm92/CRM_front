
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { parentsService } from "../../../services/parents";

const AddParents: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await parentsService.create(values);
      message.success("Ota-ona muvaffaqiyatli qo'shildi");
      navigate("/parents");
    } catch (error) {
      message.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Yangi ota-ona qo'shish</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-2xl"
        >
          <Form.Item
            label="Ism"
            name="firstName"
            rules={[{ required: true, message: "Iltimos ismni kiriting" }]}
          >
            <Input className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Familiya"
            name="lastName"
            rules={[{ required: true, message: "Iltimos familiyani kiriting" }]}
          >
            <Input className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: "Iltimos telefon raqamni kiriting" }]}
          >
            <Input className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Kasbi"
            name="job"
            rules={[{ required: true, message: "Iltimos kasbni kiriting" }]}
          >
            <Input className="h-10 rounded-lg" />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/parents")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddParents;

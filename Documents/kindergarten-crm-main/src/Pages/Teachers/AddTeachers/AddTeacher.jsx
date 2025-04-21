import React, { useState } from "react";
import "./AddTeacher.css";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import Input from "../../../components/Inputs/Input/Input";
import DateField from "../../../components/DataField/DataField";
import SelectField from "../../../components/SelectField/SelectField";
import instance from "../../../api/axios";

function AddTeacher() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    lastname: "",
    middlename: "",
    birthdate: "",
    gender: "",
    address: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "/teacher";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.lastname ||
      !formData.birthdate ||
      !formData.gender ||
      !formData.phone_number
    ) {
      setError("Barcha majburiy maydonlarni to'ldiring!");
      setLoading(false);
      return;
    }
    const data = {
      username: formData.username,
      password: formData.password,
      role: "TEACHER",
      name: formData.name,
      lastname: formData.lastname,
      middlename: formData.middlename,
      birthdate: formData.birthdate,
      gender: formData.gender,
      address: formData.address,
      phone_number: formData.phone_number,
    };
    try {
      const response = await instance.post(API_URL, data);
      alert("O'qituvchi muvaffaqiyatli qo'shildi!");
      setFormData({
        username: "",
        password: "",
        name: "",
        lastname: "",
        middlename: "",
        birthdate: "",
        gender: "",
        address: "",
        phone_number: "",
      });
    } catch (err) {
      console.error("Xatolik:", err.response?.data || err.message);
      setError(err.response?.data?.message || JSON.stringify(err.response?.data) || "Qo'shishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      password: "",
      name: "",
      lastname: "",
      middlename: "",
      birthdate: "",
      gender: "",
      address: "",
      phone_number: "",
    });
    setError("");
  };

  return (
    <div className="at_wrapper">
      <div className="header-student-page">
        <h1>O'qituvchini qo'shish</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            style={{ background: '#e57373', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
            onClick={handleCancel}
            disabled={loading}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            style={{ background: '#80cbc4', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
      <form className="form_wrapper" onSubmit={e => e.preventDefault()}>
        <div className="form_wrapper_info">
          <div className="add-teacher-top">
            <div className="add-teacher-image">
              <ImageUpload />
            </div>
            <div className="add-teacher-info">
              <Input
                label="Username"
                value={formData.username}
                onChange={handleInputChange}
                name="username"
                placeholder="shokirjon.sultonov"
              />
              <Input
                label="Parol"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                placeholder="Parol kiriting"
              />
              <Input
                label="Ism"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                placeholder="Shokirjon"
              />
              <Input
                label="Familiya"
                value={formData.lastname}
                onChange={handleInputChange}
                name="lastname"
                placeholder="Sultonov"
              />
              <Input
                label="Sharifi"
                value={formData.middlename}
                onChange={handleInputChange}
                name="middlename"
                placeholder="Tursinjon o’gli"
              />
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                style={{marginBottom: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{marginBottom: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                required
              >
                <option value="">Jinsini tanlang</option>
                <option value="MALE">O'g'il bola</option>
                <option value="FEMALE">Qiz bola</option>
              </select>
              <Input
                label="Yashash manzili"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                placeholder="Toshkent, Guliston"
              />
            </div>
          </div>
          <div className="add-teacher-bottom">
            <Input
              label="Tel raqami"
              value={formData.phone_number}
              onChange={handleInputChange}
              name="phone_number"
              placeholder="+998 (93) 123-45-67"
            />
            {/* Qo'shimcha maydonlar uchun joy (specialist, tajriba, ma'lumoti va h.k.) */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddTeacher;

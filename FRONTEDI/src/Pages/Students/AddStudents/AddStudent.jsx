import React, { useState } from "react";
import "./AddStudent.css";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import Input from "../../../components/Inputs/Input/Input";
import Calendar from "react-calendar";
import instance from "../../../api/axios";

function AddStudent() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    middlename: "",
    birthdate: "",
    address: "",
    payment: "",
    phone_number: "",
    gender: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    console.log("FORMDATA:", formData);
    console.log("Majburiy:", !!formData.username, !!formData.name, !!formData.lastname, !!formData.birthdate, !!formData.gender, !!formData.password);
    if (!formData.username || !formData.name || !formData.lastname || !formData.birthdate || !formData.gender || !formData.password) {
      setError("Barcha majburiy maydonlarni to'ldiring!");
      setLoading(false);
      return;
    }
    try {
      const data = {
        username: formData.username,
        name: formData.name,
        lastname: formData.lastname,
        middlename: formData.middlename,
        birthdate: formData.birthdate,
        gender: formData.gender,
        address: formData.address,
        payment: formData.payment,
        phone_number: formData.phone_number,
        password: formData.password,
        role: "student"
      };
      console.log("Yuborilayotgan data:", data);
      const response = await instance.post("/student/createStudent", data);
      console.log("Backend javobi:", response.data);
      alert("O'quvchi muvaffaqiyatli qo'shildi!");
      setFormData({
        username: "",
        name: "",
        lastname: "",
        middlename: "",
        birthdate: "",
        address: "",
        payment: "",
        phone_number: "",
        gender: "",
        password: "",
      });
    } catch (err) {
      console.error("Xatolik:", err);
      setError(err.response?.data?.message || err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      name: "",
      lastname: "",
      middlename: "",
      birthdate: "",
      address: "",
      payment: "",
      phone_number: "",
      gender: "",
      password: "",
    });
    setError("");
  };

  return (
    <div className="as_wrapper">
      <div className="header-student-page">
        <h1>O’quvchilarni qo’shish</h1>
        {/* Tugmalarni to'g'ridan-to'g'ri shu yerga joylaymiz va eventlarni ishonchli bog'laymiz */}
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
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Yuklanmoqda...' : 'Saqlash'}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>

      <div className="form_wrapper">
        <div className="form_wrapper_info">
          <div className="add-student-top">
            <div className="add-student-image">
              <ImageUpload />
            </div>

            <div className="add-student-info">
              <Input
                label="Foydalanuvchi nomi"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
                placeholder="Masalan: bari.fari"
                required
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
              {/* DateField o'rniga oddiy input type="date" ishlatamiz */}
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                style={{marginBottom: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
              />
              {/* SelectField o'rniga oddiy select ishlatamiz */}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{marginBottom: '12px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                required
              >
                <option value="">Jinsini tanlang</option>
                <option value="male">O'g'il bola</option>
                <option value="female">Qiz bola</option>
              </select>
              <Input
                label="Parol"
                value={formData.password}
                name="password"
                type="password"
                onChange={handleInputChange}
                placeholder="Parol kiriting"
                required
              />
              <Input
                label="Yashash manzili"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                placeholder="Toshkent, Guliston"
              />
            </div>
          </div>

          <div className="add-student-bottom">
            <Input
              label="To’lov summa"
              value={formData.payment}
              onChange={handleInputChange}
              name="payment"
              placeholder="500 000 so’m"
            />
            <Input
              label="Ota-Onasini tel raqami"
              value={formData.phone_number}
              onChange={handleInputChange}
              name="phone_number"
              placeholder="+998 (93) 123-45-67"
            />
          </div>
        </div>

        <div>
          
        </div>
      </div>
    </div>
  );
}

export default AddStudent;

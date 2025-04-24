import React, { useState } from "react";
import instance from "../../api/axios";
import "./Course.css";

function AddCourse() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
    if (!formData.name || !formData.description || !formData.duration || !formData.status) {
      setError("Barcha majburiy maydonlarni to'ldiring!");
      setLoading(false);
      return;
    }
    try {
      await instance.post("/course", {
        ...formData,
        duration: Number(formData.duration)
      });
      setSuccess("Kurs muvaffaqiyatli qo'shildi!");
      setFormData({ name: "", description: "", duration: "", status: "ACTIVE" });
    } catch (err) {
      setError(err.response?.data?.message || JSON.stringify(err.response?.data) || "Qo'shishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", duration: "", status: "ACTIVE" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="at_wrapper">
      <div className="header-student-page">
        <h1>Kurs qo'shish</h1>
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
        {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      </div>
      <form className="form_wrapper" onSubmit={e => e.preventDefault()}>
        <div className="form_wrapper_info">
          <div className="add-teacher-top">
            <div className="add-teacher-info">
              <div className="form-group">
                <label>Kurs nomi</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Masalan: Matematika"
                />
              </div>
              <div className="form-group">
                <label>Izoh</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Kurs haqida qisqacha"
                />
              </div>
              <div className="form-group">
                <label>Kurs davomiyligi (oy)</label>
                <input
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Masalan: 6"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="ACTIVE">Faol</option>
                  <option value="INACTIVE">Nofaol</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;

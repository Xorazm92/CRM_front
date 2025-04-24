// Converted from AddTeachers/AddTeacher.jsx to AddTeachers/AddTeacher.tsx with TypeScript support
import React, { useState } from "react";

interface AddTeacherProps {
  onAdd: (teacher: any) => void;
}

const AddTeacher: React.FC<AddTeacherProps> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    onAdd({ name, contact });
    setName("");
    setContact("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ism" />
      <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Kontakt" />
      <button type="submit">Qo'shish</button>
    </form>
  );
};

export default AddTeacher;

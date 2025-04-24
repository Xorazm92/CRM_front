// Converted from Teachers/Teacher.jsx to Teachers/Teacher.tsx with TypeScript support
import React from "react";

interface TeacherProps {
  teacher: {
    id: string | number;
    full_name?: string;
    name?: string;
    birthdate?: string;
    gender?: string;
    contact?: string;
  };
}

const Teacher: React.FC<TeacherProps> = ({ teacher }) => (
  <div className="p-4 border rounded mb-2">
    <div><b>F.I.Sh.:</b> {teacher.full_name || teacher.name}</div>
    <div><b>Tug‘ilgan sana:</b> {teacher.birthdate}</div>
    <div><b>Jinsi:</b> {teacher.gender}</div>
    <div><b>Kontakt:</b> {teacher.contact}</div>
  </div>
);

export default Teacher;

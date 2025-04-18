
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../../components/DataTable/DataTable";
import images from "../../../images";

function Teacher() {
  const [teachers] = useState([
    {
      id: 1,
      name: "Sultonov Shokirjon Tursinjon o'g'li",
      birthDate: "15.05.2021",
      gender: "O'g'il bola",
      contact: "+998965865745",
      attendance: true,
    },
    {
      id: 2,
      name: "Nodirova Shodiya Tursinjon qizi",
      birthDate: "15.05.2021",
      gender: "Qiz bola",
      contact: "+998914747485",
      attendance: false,
    },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">O'qituvchilar</h1>
        <Link 
          to="/add-teacher" 
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <img src={images.add_icon} alt="add" className="w-5 h-5 mr-2" />
          O'qituvchi qo'shish
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <DataTable
          data={teachers}
          columns={[
            { title: "F.I.O", key: "name" },
            { title: "Tug'ilgan sana", key: "birthDate" },
            { title: "Jinsi", key: "gender" },
            { title: "Telefon", key: "contact" },
            { title: "Holati", key: "attendance" },
          ]}
        />
      </div>
    </div>
  );
}

export default Teacher;

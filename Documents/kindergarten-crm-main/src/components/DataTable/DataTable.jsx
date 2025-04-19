import React, { useEffect, useState } from "react";
import "./DataTable.css";
import images from "../../images";
import Payment from "../Payment/Payment";

const DataTable = ({ data = [], type, person, onEdit, onDelete }) => {
  const [isChecked, setIsChecked] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const handlePaymentClick = (personId) => {
    setSelectedPersonId(personId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPersonId(null);
  };

  useEffect(() => {
    console.log("Received data:", data);
  }, [data]);

  const handleCheckboxChange = (id) => {
    setIsChecked((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: !prevCheckedItems[id],
    }));
  };

  const getHeadersByType = (type) => {
    switch (type) {
      case "students":
        return [
          "#",
          "Bolalar F.I.O",
          "Tug'ilgan sana",
          "Jinsi",
          "Gurux raqami",
          "Davomat",
          "To'lov",
          "Imkoniyatlar",
        ];
      case "teachers":
        return [
          "#",
          "O'qituvchilar F.I.O",
          "Tug'ilgan sana",
          "Jinsi",
          "Kontakt",
          "Imkoniyatlar",
        ];
      case "groups":
        return ["#", "Nomi", "Boshlangan sana", "Daraja", "Imkoniyatlar"];
      case "parents":
        return [
          "#",
          "Ota-Onalar F.I.O",
          "Tel raqam",
          "Farzandlar soni",
          "Maktab davomiyligi",
          "To'lov holati",
          "Kasbi",
          "Imkoniyatlar",
        ];
      case "reports":
        return ["#", "Bolalar F.I.O", "Sana", "Summa"];
      default:
        return ["#"];
    }
  };

  const headers = getHeadersByType(type);

  if (!data || data.length === 0) {
    return <div>Ma'lumotlar mavjud emas</div>;
  }

  return (
    <table className="student-table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} style={{ width: "auto", textAlign: "left" }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((person, idx) => (
          <tr key={person.user_id || person.id || idx}>
            <td className="checkbox-index">
              <input
                type="checkbox"
                checked={isChecked[person.id] || false}
                onChange={() => handleCheckboxChange(person.id)}
              />
              <span>{idx + 1}</span>
            </td>

            {/* Rendering for different types */}
            {/* Students */}
            {type === "students" && (
              <>
                <td>
                  <div className="person-info">
                    <img width={36} src={images.user} alt="user image" />
                    {person.name}
                  </div>
                </td>
                <td className="birthday">{person.birthDate}</td>
                <td
                  className="gender"
                  style={{
                    color: person.gender === "O'g'il bola" ? "green" : "red",
                  }}
                >
                  {person.gender}
                </td>
                <td className="groups">{person.group}</td>
                <td className="attendance">
                  {person.attendance ? (
                    <img width={24} src={images.true_icon} alt="attendance" />
                  ) : (
                    <img width={24} src={images.falseIcon} alt="attendance" />
                  )}
                </td>
                <td style={{ position: "relative" }}>
                  <button
                    style={{
                      backgroundColor: isChecked[person.id]
                        ? "var(--color-light-gray-1)"
                        : "transparent",
                      boxShadow: isChecked[person.id]
                        ? "2px 2px 2px 0px #0000001A"
                        : "none",
                    }}
                    className="payment-btn"
                    onClick={() => handlePaymentClick(person.id)}
                  >
                    To'lov
                  </button>
                  {isModalOpen && selectedPersonId === person.id && (
                    <Payment
                      isOpen={isModalOpen}
                      closeModal={closeModal}
                      person={person}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => onEdit && onEdit(person)}>Edit</button>
                  <button onClick={() => onDelete && onDelete(person.user_id || person.id)}>Delete</button>
                </td>
              </>
            )}

            {/* Teachers */}
            {type === "teachers" && (
              <>
                <td>
                  <div className="person-info">
                    <img width={36} src={images.user} alt="user image" />
                    {person.name}
                  </div>
                </td>
                <td className="birthday">{person.birthDate}</td>
                <td
                  className="gender"
                  style={{
                    color: person.gender === "Erkak" ? "green" : "red",
                  }}
                >
                  {person.gender}
                </td>
                <td className="contact">{person.contact}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(person)}>Edit</button>
                  <button onClick={() => onDelete && onDelete(person.user_id || person.id)}>Delete</button>
                </td>
              </>
            )}

            {/* Groups */}
            {type === "groups" && (
              <>
                <td className="names-person">{person.name}</td>
                <td className="start-date">{person.startDate}</td>
                <td className="level">{person.level}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(person)}>Edit</button>
                  <button onClick={() => onDelete && onDelete(person.user_id || person.id)}>Delete</button>
                </td>
              </>
            )}

            {/* Parents */}
            {type === "parents" && (
              <>
                <td>{person.name}</td>
                <td className="phone-number">{person.contact}</td>
                <td className="children-count">{person.count}</td>
                <td className="school-attendance">{person.school_length}</td>
                <td className="payment-status">{person.payment_status}</td>
                <td className="job">{person.jobs}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(person)}>Edit</button>
                  <button onClick={() => onDelete && onDelete(person.user_id || person.id)}>Delete</button>
                </td>
              </>
            )}

            {/* Reports */}
            {type === "reports" && (
              <>
                <td>{person.name}</td>
                <td className="date">{person.date}</td>
                <td className="sum">{person.summa}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(person)}>Edit</button>
                  <button onClick={() => onDelete && onDelete(person.user_id || person.id)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

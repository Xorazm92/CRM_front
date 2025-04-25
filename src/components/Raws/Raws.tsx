import React from "react";
import "./Raws.css";
import icons from "../../images/icons";

export interface RawsProps {
  index?: number;
  name?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

const Raws: React.FC<RawsProps> = ({
  index = 1,
  name = "Sultonov Shokirjon Tursinjon o’g’li",
  birthdate = "15.05.1996",
  gender = "O’g’il bola",
  phone = "+998 (93) 123-45-67",
  location = "Toshkent.Sentr",
  profileImage,
}) => {
  return (
    <div className="user-profile-row">
      <span className="user-index">{index}</span>
      <img src={profileImage || icons.user} alt="Profile" className="profile-picture" />
      <span className="user-name">{name}</span>
      <span className="user-birthdate">{birthdate}</span>
      <span className="user-gender">{gender}</span>
      <span className="user-phone">{phone}</span>
      <span className="user-location">{location}</span>
    </div>
  );
};

export default Raws;

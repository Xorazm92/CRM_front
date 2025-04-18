import React from "react";
import "./Raws.css";
import images from "../../images";

const Raws = () => {
  return (
    <div className="user-profile-row">
      <span className="user-index">1</span>
      <img src={images.user} alt="Profile" className="profile-picture" />
      <span className="user-name">Sultonov Shokirjon Tursinjon o’g’li</span>
      <span className="user-birthdate">15.05.1996</span>
      <span className="user-gender">O’g’il bola</span>
      <span className="user-phone">+998 (93) 123-45-67</span>
      <span className="user-location">Toshkent.Sentr</span>
    </div>
  );
};

export default Raws;

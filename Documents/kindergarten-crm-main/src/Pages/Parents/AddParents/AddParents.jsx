import React from "react";
import "./AddParents.css";
import FormComponent from "../../../components/FormComponent/FormComponent";
import Button from "../../../components/Button/Button";
import SaveCancelBtn from "../../../components/SaveCancelBtn/SaveCancelBtn";

function AddParents() {

  return (
    <div className="ap_wrapper">
      <div className="header-student-page">
        <h1>Ota-Onalarni qo’shish</h1>
        <SaveCancelBtn />
      </div>
      <div className="form-component-wrapper">
        <FormComponent />
      </div>
    </div>
  );
}

export default AddParents;

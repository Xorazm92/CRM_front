import React, { useState } from "react";
import "./ImageUpload.css"; // Add styles in a separate CSS file
import images from "../../images"; // Assuming images contains icons like the one you uploaded

const ImageUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">Rasm</label>
      <div className="image-upload-box">
        <input
          type="file"
          accept="image/*"
          className="image-upload-input"
          id="imageInput"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <label htmlFor="imageInput" className="image-upload-placeholder">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="image-preview"
            />
          ) : (
            <div className="upload-placeholder-content">
              <img
              
                src={images.imageAdd}
                alt="Upload Icon"
                className="upload-icon"
              />
              <p>Rasmni kiriting</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;

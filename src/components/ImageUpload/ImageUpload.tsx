import React, { useState, ChangeEvent } from "react";
import "./ImageUpload.css";
import icons from "../../images/icons";

interface ImageUploadProps {
  onChange?: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Validate type
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayli yuklang!");
        if (onChange) onChange(null);
        return;
      }
      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Rasm hajmi 5MB dan oshmasligi kerak!");
        if (onChange) onChange(null);
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (onChange) onChange(file);
    } else {
      setError("");
      setImagePreview(null);
      if (onChange) onChange(null);
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
                src={icons.imageAdd}
                alt="Upload Icon"
                className="upload-icon"
              />
              <p>Rasmni kiriting</p>
            </div>
          )}
        </label>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
};

export default ImageUpload;

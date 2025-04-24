import React, { useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../../components/Toast";
import instance from "../../api/axios";
import "./FileUpload.css";

const FileUpload = () => {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await instance.get("/files");
      setUploadedFiles(res.data || []);
    } catch (err) {
      setToast({ message: err.message || "Fayllarni olishda xatolik", type: 'error' });
    }
  };

  React.useEffect(() => { fetchFiles(); }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setToast({ message: "Fayl tanlanmagan", type: 'error' });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await instance.post("/files/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToast({ message: "Fayl yuklandi!", type: 'success' });
      setSelectedFile(null);
      fileInputRef.current.value = null;
      fetchFiles();
    } catch (err) {
      setToast({ message: err.message || "Yuklashda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Faylni o'chirmoqchimisiz?")) return;
    setLoading(true);
    try {
      await instance.delete(`/files/${id}`);
      setToast({ message: "Fayl o‘chirildi!", type: 'success' });
      fetchFiles();
    } catch (err) {
      setToast({ message: err.message || "O‘chirishda xatolik", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fileupload-page">
      <h2>Fayl yuklash</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={loading} />
        <button type="submit" disabled={loading}>{loading ? <ClipLoader size={18} color="#fff" /> : "Yuklash"}</button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <div className="uploaded-list">
        <h4>Yuklangan fayllar</h4>
        {loading ? <ClipLoader size={28} color="#009688" /> : null}
        <ul>
          {uploadedFiles.length === 0 ? <li>Fayllar topilmadi</li> : uploadedFiles.map(f => (
            <li key={f.id}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
              <button className="delete-btn" onClick={() => handleDelete(f.id)}>O‘chirish</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;

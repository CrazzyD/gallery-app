'use client';

import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      setLoading(true);
      setSuccess(false);

      await axios.post(`${API}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setSuccess(true);

    } catch (err) {
      console.error('UPLOAD ERROR:', err.response?.data || err.message);
      alert('Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📤 Upload Image</h1>

        <div style={styles.previewBox}>
          {preview ? (
            <img src={preview} style={styles.previewImg} />
          ) : (
            <div style={styles.placeholder}>Drop or select image</div>
          )}
        </div>

        <input type="file" onChange={handleFileChange} style={styles.file} />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={styles.input}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={styles.textarea}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {success && (
          <p style={styles.success}>✔ Uploaded successfully</p>
        )}
      </div>
    </div>
  );
}
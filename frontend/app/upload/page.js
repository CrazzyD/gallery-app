'use client';

import { useState } from 'react';
import axios from 'axios';

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

      await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // reset
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📤 Upload Image</h1>

        {/* PREVIEW */}
        <div style={styles.previewBox}>
          {preview ? (
            <img src={preview} style={styles.previewImg} />
          ) : (
            <div style={styles.placeholder}>
              Drop or select image
            </div>
          )}
        </div>

        {/* FILE INPUT */}
        <input type="file" onChange={handleFileChange} style={styles.file} />

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={styles.input}
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={styles.textarea}
        />

        {/* BUTTON */}
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

        {/* SUCCESS */}
        {success && (
          <p style={styles.success}>✔ Uploaded successfully</p>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f5f5',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 500,
    background: '#fff',
    padding: 25,
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
  },

  previewBox: {
    width: '100%',
    height: 250,
    background: '#eee',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  placeholder: {
    color: '#888',
  },

  file: {
    marginBottom: 15,
  },

  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #ddd',
  },

  textarea: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #ddd',
    minHeight: 80,
  },

  button: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  success: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
  },
};
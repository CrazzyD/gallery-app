'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/images')
      .then((res) => setImages(res.data.images))
      .catch(console.error);
  }, []);

  /* =========================
     OPEN IMAGE
  ========================= */
  const openImage = async (img) => {
    setSelected(img);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/comments/${img.id}`
      );

      setComments(res.data);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  /* =========================
     LIKE
  ========================= */
  const toggleLike = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/likes/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== id) return img;

          const updated = {
            ...img,
            liked: !img.liked,
            likes_count: img.liked
              ? img.likes_count - 1
              : img.likes_count + 1,
          };

          if (selected?.id === id) setSelected(updated);

          return updated;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     DELETE IMAGE 🔥
  ========================= */
  const deleteImage = async (id) => {
    if (!confirm('Удалить изображение?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages((prev) => prev.filter((img) => img.id !== id));

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error('DELETE ERROR:', err);
      alert('Не удалось удалить');
    }
  };

  /* =========================
     SEND COMMENT
  ========================= */
  const sendComment = async () => {
    if (!commentText.trim() || !selected) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${selected.id}`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🖼 Gallery</h1>

      {/* GRID */}
      <div style={styles.grid}>
        {images.map((img) => (
          <div key={img.id} style={styles.card}>
            <img
              src={`http://localhost:5000${img.image_url}`}
              onClick={() => openImage(img)}
              style={styles.image}
            />

            <div style={styles.cardBody}>
              <h3 style={{ margin: 0 }}>{img.title}</h3>

              <p style={styles.desc}>{img.description}</p>

              <button
                onClick={() => toggleLike(img.id)}
                style={{
                  ...styles.likeBtn,
                  background: img.liked ? '#ff4d4f' : '#eee',
                  color: img.liked ? '#fff' : '#000',
                }}
              >
                ❤️ {img.likes_count}
              </button>

              {/* 🗑 DELETE (если владелец — backend всё равно проверит) */}
              {token && (
                <button
                  onClick={() => deleteImage(img.id)}
                  style={styles.deleteBtn}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div style={styles.modal} onClick={() => setSelected(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>

            {/* IMAGE */}
            <div style={styles.left}>
              <img
                src={`http://localhost:5000${selected.image_url}`}
                style={styles.modalImg}
              />
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
              <h2>{selected.title}</h2>
              <p style={styles.desc}>{selected.description}</p>

              <button
                onClick={() => toggleLike(selected.id)}
                style={{
                  ...styles.likeBtn,
                  background: selected.liked ? '#ff4d4f' : '#eee',
                  color: selected.liked ? '#fff' : '#000',
                }}
              >
                ❤️ {selected.likes_count}
              </button>

              {/* 🗑 DELETE BUTTON IN MODAL */}
              <button
                onClick={() => deleteImage(selected.id)}
                style={styles.deleteBtn}
              >
                🗑 Delete
              </button>

              <hr style={{ margin: '15px 0' }} />

              {/* CHAT */}
              <div style={styles.chat}>
                {comments.map((c) => (
                  <div key={c.id} style={styles.comment}>
                    <b>{c.username}</b>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div style={styles.inputBox}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Написать..."
                  style={styles.input}
                />

                <button onClick={sendComment} style={styles.sendBtn}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: 30,
  },
  title: { textAlign: 'center', marginBottom: 30 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
    maxWidth: 1200,
    margin: '0 auto',
  },

  card: {
    background: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },

  image: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
    cursor: 'pointer',
  },

  cardBody: { padding: 12 },

  desc: { color: '#666', fontSize: 14 },

  likeBtn: {
    marginTop: 10,
    padding: '6px 10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },

  deleteBtn: {
    marginTop: 8,
    padding: '6px 10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    background: '#111',
    color: '#fff',
  },

  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '90%',
    height: '85%',
    background: '#fff',
    borderRadius: 12,
    display: 'flex',
    overflow: 'hidden',
  },

  left: { flex: 2, background: '#000' },

  modalImg: { width: '100%', height: '100%', objectFit: 'contain' },

  right: {
    flex: 1,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #eee',
  },

  chat: { flex: 1, overflowY: 'auto' },

  comment: { marginBottom: 10 },

  inputBox: {
    display: 'flex',
    gap: 5,
    marginTop: 10,
  },

  input: {
    flex: 1,
    padding: 8,
    border: '1px solid #ddd',
    borderRadius: 8,
  },

  sendBtn: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: 8,
    background: '#4f46e5',
    color: '#fff',
    cursor: 'pointer',
  },
};
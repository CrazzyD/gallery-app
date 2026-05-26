'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [token, setToken] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (!API) return;
    axios
      .get(`${API}/images`)
      .then((res) => setImages(res.data.images ?? []))
      .catch(console.error);
  }, [API]);

  const openImage = async (img) => {
    setSelected(img);
    try {
      const res = await axios.get(`${API}/comments/${img.id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  const toggleLike = async (id) => {
    try {
      await axios.post(
        `${API}/likes/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImages((prev) =>
        prev.map((img) => {
          if (img.id !== id) return img;
          const updated = {
            ...img,
            liked: !img.liked,
            likes_count: img.liked ? img.likes_count - 1 : img.likes_count + 1,
          };
          if (selected?.id === id) setSelected(updated);
          return updated;
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm('Удалить изображение?')) return;
    try {
      await axios.delete(`${API}/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    }
  };

  const sendComment = async () => {
    if (!commentText.trim() || !selected) return;
    try {
      const res = await axios.post(
        `${API}/comments/${selected.id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!API || !imageUrl) return '';
    return `${API.replace('/api', '')}${imageUrl}`;
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🖼 Gallery</h1>

      <div style={styles.grid}>
        {images.map((img) => (
          <div key={img.id} style={styles.card}>
            <img
              src={getImageUrl(img.image_url)}
              onClick={() => openImage(img)}
              style={styles.image}
              alt={img.title}
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

      {selected && (
        <div style={styles.modal} onClick={() => setSelected(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.left}>
              <img
                src={getImageUrl(selected.image_url)}
                style={styles.modalImg}
                alt={selected.title}
              />
            </div>
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
              {token && (
                <button
                  onClick={() => deleteImage(selected.id)}
                  style={styles.deleteBtn}
                >
                  🗑 Delete
                </button>
              )}
              <hr style={{ margin: '15px 0' }} />
              <div style={styles.chat}>
                {comments.map((c) => (
                  <div key={c.id} style={styles.comment}>
                    <b>{c.username}</b>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>
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

const styles = {
  page: { padding: '20px' },
  title: { textAlign: 'center', marginBottom: '30px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  image: { width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' },
  cardBody: { padding: '12px' },
  desc: { color: '#666', fontSize: '14px' },
  likeBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    background: '#ff4d4f',
    color: '#fff',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalBox: {
    background: '#fff',
    borderRadius: '12px',
    display: 'flex',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  left: { flex: 1 },
  modalImg: { width: '100%', height: '100%', objectFit: 'cover' },
  right: {
    width: '320px',
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  chat: { flex: 1, overflowY: 'auto', marginBottom: '10px' },
  comment: {
    padding: '8px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  },
  inputBox: { display: 'flex', gap: '8px' },
  input: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  sendBtn: {
    padding: '8px 14px',
    background: '#1677ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
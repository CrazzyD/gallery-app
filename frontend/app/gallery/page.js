'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    axios
      .get(`${API}/images`)
      .then((res) => setImages(res.data.images))
      .catch(console.error);
  }, [API]);

  /* =========================
     OPEN IMAGE
  ========================= */
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

  /* =========================
     LIKE
  ========================= */
  const toggleLike = async (id) => {
    try {
      await axios.post(
        `${API}/likes/${id}`,
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
     DELETE IMAGE
  ========================= */
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

  /* =========================
     SEND COMMENT
  ========================= */
  const sendComment = async () => {
    if (!commentText.trim() || !selected) return;

    try {
      const res = await axios.post(
        `${API}/comments/${selected.id}`,
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

      <div style={styles.grid}>
        {images.map((img) => (
          <div key={img.id} style={styles.card}>
            <img
              src={`${API.replace('/api', '')}${img.image_url}`}
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

            <div style={styles.left}>
              <img
                src={`${API.replace('/api', '')}${selected.image_url}`}
                style={styles.modalImg}
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

              <button
                onClick={() => deleteImage(selected.id)}
                style={styles.deleteBtn}
              >
                🗑 Delete
              </button>

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
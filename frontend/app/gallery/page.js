/* =========================
   STYLES (FIX FOR VERCEL)
========================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    padding: 30,
  },

  title: {
    textAlign: 'center',
    marginBottom: 30,
  },

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

  cardBody: {
    padding: 12,
  },

  desc: {
    color: '#666',
    fontSize: 14,
  },

  likeBtn: {
    marginTop: 10,
    padding: '6px 10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    marginRight: 8,
  },

  deleteBtn: {
    marginTop: 10,
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
    zIndex: 9999,
  },

  modalBox: {
    width: '90%',
    height: '85%',
    background: '#fff',
    borderRadius: 12,
    display: 'flex',
    overflow: 'hidden',
  },

  left: {
    flex: 2,
    background: '#000',
  },

  modalImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  right: {
    flex: 1,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #eee',
  },

  chat: {
    flex: 1,
    overflowY: 'auto',
  },

  comment: {
    marginBottom: 10,
  },

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
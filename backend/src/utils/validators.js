export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 30;
};

export const validateImageTitle = (title) => {
  return title.length >= 1 && title.length <= 200;
};

export const validateImageFile = (file) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) return { valid: false, error: 'No file provided' };
  if (!allowedMimes.includes(file.mimetype)) {
    return { valid: false, error: 'Only JPG, PNG, and WEBP files are allowed' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must not exceed 10MB' };
  }

  return { valid: true };
};

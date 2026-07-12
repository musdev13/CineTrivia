import axios from 'axios';

// Створюємо інстанс Axios з базовою URL-адресою TMDB v3 API
export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо інтерцептор для підмішування авторизаційного токена до кожного запиту
api.interceptors.request.use((config) => {
  // Зчитуємо токен з екологічних змінних або з localStorage (якщо гравець ввів його в налаштуваннях)
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN || localStorage.getItem('tmdb_access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
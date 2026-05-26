# 🚀 Быстрый старт проекта

## Этап 1: Установка зависимостей

### Требования:
- **Node.js 18+** ([скачать](https://nodejs.org/))
- **PostgreSQL 16+** или **Docker Desktop** 
- **Git**

### Проверка установки:
```bash
node --version
npm --version
```

## Этап 2: Запуск с Docker Compose (рекомендуется)

### Шаг 1: Создать .env файл
```bash
cp .env.example .env
```

### Шаг 2: Запустить все сервисы
```bash
docker-compose up --build
```

После запуска приложение будет доступно по адресам:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## Этап 3: Ручной запуск (без Docker)

### Шаг 1: Настроить базу данных PostgreSQL
```bash
# Создать базу данных
createdb image_sharing

# Или через psql
psql -U postgres -c "CREATE DATABASE image_sharing;"
```

### Шаг 2: Запустить миграции БД
```bash
cd database
node migrate.js
cd ..
```

### Шаг 3: Запустить Backend
```bash
cd backend

# Создать .env файл
cp .env.example .env

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

Backend будет работать на: http://localhost:5000

### Шаг 4: Запустить Frontend (в отдельном терминале)
```bash
cd frontend

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

Frontend будет работать на: http://localhost:3000

## Этап 4: Первое использование

1. Откройте http://localhost:3000 в браузере
2. Нажмите "Sign Up" для регистрации
3. Создайте аккаунт
4. Нажмите "Upload" для загрузки первого изображения
5. Перейдите в "View Gallery" для просмотра ленты

## Структура файлов
```
├── backend/          # Express.js API
├── frontend/         # Next.js приложение
├── database/         # PostgreSQL схема и миграции
├── docker-compose.yml
├── .env.example
└── README.md
```

## Переменные окружения

### Backend (.env)
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=image_sharing
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Изображения
- `GET /api/images` - Все изображения
- `GET /api/images/:id` - Одно изображение
- `POST /api/images/upload` - Загрузить
- `DELETE /api/images/:id` - Удалить

### Лайки
- `POST /api/likes/:imageId/like` - Добавить лайк
- `DELETE /api/likes/:imageId/like` - Удалить лайк

### Пользователи
- `GET /api/users/:userId` - Профиль
- `GET /api/users/:userId/images` - Изображения пользователя

## Помощь

### Проблемы с подключением к БД?
Убедитесь что PostgreSQL запущен и параметры в .env верны

### Порт уже используется?
Измените PORT в .env на другой (например 5001)

### Нужна помощь?
Смотрите README.md для подробной документации

---

✅ **Проект готов к работе!** Начните с загрузки изображений и наслаждайтесь приложением 🎉

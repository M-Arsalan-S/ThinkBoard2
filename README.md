# 🚀 ThinkBoard

**ThinkBoard** is a premium, modern full-stack note-taking application built with the MERN stack. It features a sleek dark-themed UI, robust authentication via AWS Cognito, and is fully containerized for seamless deployment.

![License](https://img.shields.io/badge/license-ISC-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Node](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933)

---

## ✨ Features

- **Dynamic Note Management**: Create, view, and organize notes with a real-time reactive interface.
- **Secure Authentication**: Integrated with **AWS Cognito** for secure login, signup, and email verification.
- **Modern Aesthetics**: Built with **Tailwind CSS** and **DaisyUI** for a premium, glassmorphic dark mode experience.
- **Rate Limiting**: Backend protection using **Upstash Redis** to ensure reliability.
- **Fully Dockerized**: Ready for production with optimized Docker images for both Frontend and Backend.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Authentication**: AWS Cognito.
- **Caching/Rate Limiting**: Upstash Redis.
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start with Docker

The fastest way to get ThinkBoard running is using our pre-built images from Docker Hub.

### 1. Prerequisite
Ensure you have **Docker Desktop** installed.

### 2. Run with Docker Compose
Create a `docker-compose.yml` (or use the one provided in this repo) and run:

```bash
docker compose up
```

The application will be available at:
- **Frontend**: `http://localhost:80`
- **Backend API**: `http://localhost:5001`

---

## 💻 Local Development

If you'd like to run the project in development mode:

### 1. Clone the repository
```bash
git clone https://github.com/M-Arsalan-S/mern-thinkboard.git
cd mern-thinkboard
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory with the following:
```env
MONGO_URI=your_mongodb_uri
PORT=5001
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_app_client_id
```

### 3. Install & Run
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Hub Images

Our official images are hosted on Docker Hub:
- [Backend Image](https://hub.docker.com/r/arsalan7/thinkboard-backend)
- [Frontend Image](https://hub.docker.com/r/arsalan7/thinkboard-frontend)

To manually pull the latest versions:
```bash
docker pull arsalan7/thinkboard-backend:latest
docker pull arsalan7/thinkboard-frontend:latest
```

---

## 📄 License

This project is licensed under the **ISC License**.

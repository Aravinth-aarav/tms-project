# Ticket Management System (TMS) - Dockerized Project Overview

This document summarizes the core components, structure, and Docker configuration of the Ticket Management System (TMS) project.

## 🚀 Project Architecture

The project follows a **MERN Stack** (MongoDB, Express, React, Node.js) architecture, now fully containerized using Docker.

### 1. Frontend (Client)

- **Technology**: React.js
- **Build Tool**: `node:18` (Multi-stage build)
- **Production Server**: `nginx:alpine`
- **Docker Port Mapping**: `3000:80` (Internal port 80 mapped to your machine's 3000)

### 2. Backend (Server)

- **Technology**: Node.js & Express.js
- **Core Library**: `mongoose` (Database connectivity), `bcryptjs` (Password hashing), `jsonwebtoken` (Auth)
- **Docker Image**: `node:18-alpine` (Lightweight version)
- **Docker Port Mapping**: `5000:5000`

### 3. Database

- **Technology**: MongoDB
- **Docker Image**: `mongo:latest` (Official Docker Hub image)
- **Default Port**: `27017`

---

## 🛠️ Docker Configuration Files

These files are the "blueprints" for your project’s environment.

- **`client/Dockerfile`**: Contains instructions to build the React application and serve it via Nginx.
- **`server/Dockerfile`**: Sets up the Node.js environment, installs production dependencies, and starts the Express server.
- **`docker-compose.yml`**: The "Manager" that runs the database, server, and client containers together in a private network.
- **`run_app.bat`**: A Windows batch script that automates starting the docker containers and opening your browser.

---

## ☁️ Distribution (Docker Hub)

Your built images are stored in the cloud for easy deployment:

- **Server Image**: `aravinth2005/tms-server:latest`
- **Client Image**: `aravinth2005/tms-client:latest`

---

## 🔑 Key Commands for You

| Action                        | Command                                                          |
| :---------------------------- | :--------------------------------------------------------------- |
| **Start App (Foreground)**    | `docker-compose up`                                              |
| **Start App (Background)**    | `docker-compose up -d`                                           |
| **Apply Code Changes**        | `docker-compose up --build`                                      |
| **Stop & Remove App**         | `docker-compose down`                                            |
| **Create SuperAdmin Account** | `docker-compose exec server node scripts/bootstrapSuperAdmin.js` |
| **Login to Docker Hub**       | `docker login -u aravinth2005`                                   |

---

## 📄 Project Files & Folders

- `/client`: React frontend source code and Dockerfile.
- `/server`: Node.js backend source code, Dockerfile, and .env configuration.
- `docker-compose.yml`: Main orchestration file.
- `run_app.bat`: Quick-start automation file.

---

_Created for: Aravinth 2 Semester TMS Project_

# Fullstack App — Docker Setup Guide

This guide explains how to run the **Next.js frontend**, **Express backend**, and **MongoDB** using **Docker & Docker Compose**.

---

# Quick Start

## Install Dependencies

Make sure you have:

* **Docker**
* **Docker Compose**

Check:

```sh
docker --version
docker compose version
```

---

# Project Structure

```
.
├── backend/
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   └── ...
└── docker-compose.yml
```

---

# Environment Variables

## Frontend (`frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://backend:8000
```

## Backend (`backend/.env`)

```
PORT=8000
MONGO_URL=mongodb://mongo:27017/mydb
JWT_SECRET=your-secret
```

> Do not use `localhost` inside Docker containers.
> Use the **service name** (`backend`, `mongo`) instead.

---

# Starting the App

From the project root:

```sh
docker compose up -d
```

To see logs:

```sh
docker compose logs -f
```

Stop everything:

```sh
docker compose down
```

Rebuild (after code changes, especially `.env`):

```sh
docker compose build
docker compose up -d
```

---

# Accessing the App

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend  | [http://localhost:8000](http://localhost:8000) |
| MongoDB  | Internal at `mongo:27017`                      |

---

# docker-compose.yml (Reference)

```yaml
services:

  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    container_name: backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/mydb
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    container_name: mongo
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

---

# Development Commands

## Check running containers:

```sh
docker ps
```

## Restart only frontend:

```sh
docker compose restart frontend
```

## Remove all containers + volumes:

```sh
docker compose down -v
```

## Rebuild only frontend:

```sh
docker compose build frontend
```

---

# Updating Environment Variables

If you modify `.env` inside frontend or backend:

```sh
docker compose down
docker compose build
docker compose up -d
```

Next.js **requires rebuild** whenever `NEXT_PUBLIC_*` variables change.

---

# Cleanup (optional)

Remove all Docker images:

```sh
docker system prune -af
```

Remove all volumes:

```sh
docker volume prune -f
```

---

# You're ready to go!

Your fullstack app is now fully containerized and portable.
Anyone can run it with a single command:

```sh
docker compose up -d
```

---

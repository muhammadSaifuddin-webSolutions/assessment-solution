
# Task Manager - MERN Stack Application

A full-featured Task Manager built using MongoDB, Express, React, and Node.js. This app supports hierarchical tasks, archiving, completion toggles, and parent-child relationships — with a clean UI and full CRUD functionality.

---

## Prerequisites

Make sure the following are installed on your machine:

- [Node.js]
- [MongoDB]


##  Project Structure

```
/Task-Manager
  ├── backend/       # Node + Express + MongoDB
  └── frontend/      # React + Axios + Vite

##  Getting Started

### 1. Backend Setup

```terminal
cd backend
npm install
```

### 2.  MongoDB Setup

- If you already have **MongoDB Compass** or a local MongoDB server running, you're good to go.
- If not, [Download MongoDB] and follow setup instructions.

Update `.env` file in `backend/` with your MongoDB URI:
env
MONGO_URI=mongodb://localhost:27017/task-manager


### 3. Start the Backend Server

```terminal
npm start
```

This will start the backend on `http://localhost:4500`.
### 4.  Frontend Setup

```bash
cd ../frontend
npm install
```

### 5.  Start the Frontend Dev Server

```bash
npm run dev
```

This will start the React frontend on `http://localhost:5173`.

---

## Features

- Add/edit/delete tasks
- Assign parent tasks (hierarchical)
- Pagination (10 tasks per page)
- View active or archived tasks
- Mark complete/incomplete
- Auto-archive completed tasks every 5 minutes
- Clean and minimal React UI

# assessment-solution
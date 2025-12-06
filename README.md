# 🎙️ Voice-Enabled Task Tracker

A modern, full-stack task management application with voice input capabilities. Speak naturally to create tasks, and let AI intelligently parse your input to extract title, priority, status, and due date.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

---

## ✨ Features

- **🎤 Voice Task Creation** - Speak naturally (e.g., _"Remind me to call John tomorrow high priority"_) and let AI transcribe and parse your intent using OpenAI's Whisper-1 model.
- **📋 Kanban Board** - Drag and drop tasks between **To Do**, **In Progress**, and **Done** columns using a beautiful, responsive interface.
- **📝 List View** - A detailed table view of all tasks with sorting and filtering capabilities.
- **🧠 Smart Parsing** - Automatically extracts dates (_"tomorrow"_, _"next Friday"_) and priority levels from natural language.
- **🎨 Modern UI** - Clean, responsive design built with React, TypeScript, and Vanilla CSS.
- **⚡ Real-time Updates** - Powered by React Query for efficient data fetching and caching.

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| React 19          | UI Framework              |
| TypeScript        | Type Safety               |
| Vite              | Build Tool & Dev Server   |
| @hello-pangea/dnd | Drag & Drop Functionality |
| React Query       | Data Fetching & Caching   |
| Lucide React      | Icons                     |
| Axios             | HTTP Client               |
| Vanilla CSS       | Styling                   |

### Backend

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Runtime Environment             |
| Express 5  | Web Framework                   |
| TypeScript | Type Safety                     |
| MongoDB    | Database                        |
| Mongoose   | ODM                             |
| Multer     | File Upload Handling            |
| OpenAI API | Voice Transcription (Whisper-1) |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Running locally or a remote URI ([MongoDB Atlas](https://www.mongodb.com/atlas))
- **OpenAI API Key** - [Get API Key](https://platform.openai.com/api-keys)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ASSIGNEMNT
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/task-tracker
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies

Run the following command from the **root directory**:

```bash
npm run install-all
```

This installs dependencies for both the frontend and backend.

### 4. Run the Application

Start both servers with a single command:

```bash
npm run dev
```

Access the application at:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5001](http://localhost:5001)

---

## 📁 Project Structure

```
ASSIGNEMNT/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── TaskBoard.tsx     # Kanban board view
│   │   │   ├── TaskList.tsx      # List/table view
│   │   │   ├── VoiceRecorder.tsx # Voice input component
│   │   │   ├── ReviewModal.tsx   # Task review modal
│   │   │   ├── Layout.tsx        # App layout wrapper
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorPage.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api.ts            # API service functions
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Global styles
│   └── package.json
│
├── backend/                  # Express Backend
│   ├── controllers/          # Route controllers
│   ├── models/               # Mongoose models
│   │   └── Task.ts           # Task model
│   ├── routes/               # API routes
│   ├── database.ts           # MongoDB connection
│   ├── server.ts             # Express server entry
│   └── package.json
│
├── package.json              # Root package with scripts
└── README.md
```

---

## 📡 API Documentation

### Tasks Endpoints

| Method   | Endpoint         | Description                                         |
| -------- | ---------------- | --------------------------------------------------- |
| `GET`    | `/api/tasks`     | Fetch all tasks (supports `?status=...&search=...`) |
| `POST`   | `/api/tasks`     | Create a new task                                   |
| `PUT`    | `/api/tasks/:id` | Update an existing task                             |
| `DELETE` | `/api/tasks/:id` | Delete a task                                       |

### Task Schema

```typescript
interface Task {
  id: string;
  title: string; // Required
  description: string; // Optional, defaults to ""
  status: "To Do" | "In Progress" | "Done"; // Default: "To Do"
  priority: "Low" | "Medium" | "High" | "Critical"; // Default: "Medium"
  due_date?: Date; // Optional
  created_at: Date; // Auto-generated
}
```

### AI Endpoints

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| `POST` | `/api/ai/transcribe` | Transcribe audio to structured task |

**Request Body (multipart/form-data):**

- `audio`: Audio file (webm, mp3, wav, etc.)

**Response:**

```json
{
  "title": "Call John",
  "priority": "High",
  "due_date": "2025-12-07",
  "status": "To Do"
}
```

---

## 🔧 Troubleshooting

### Voice Input Issues

- Ensure your browser supports the Web Speech API (Chrome, Edge, Safari recommended)
- Grant microphone permission when prompted
- Check that your OpenAI API key is valid and has credits

### Database Connection

- Ensure MongoDB is running locally (`mongod`) or provide a valid `MONGO_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### Build Errors

- Ensure Node.js v18+ is installed
- Delete `node_modules` and `package-lock.json`, then run `npm run install-all` again

---

## 📜 Scripts Reference

| Command                           | Description                                          |
| --------------------------------- | ---------------------------------------------------- |
| `npm run install-all`             | Install all dependencies (root + frontend + backend) |
| `npm run dev`                     | Start both frontend and backend in development mode  |
| `npm run dev --prefix frontend`   | Start only the frontend                              |
| `npm run server --prefix backend` | Start only the backend                               |

---

## 📝 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for the Whisper-1 transcription API
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop functionality
- [Lucide](https://lucide.dev) for beautiful icons

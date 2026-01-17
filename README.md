# Industry 5.0 Club Management Platform

A role-based management system for student clubs, focusing on human-centric design and transparency.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, JWT Auth
- **Features**: Attendance tracking, Daily updates, Weekly reports, Secretary review system.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running (or use a cloud URI in `.env`)

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## User Roles
1. **Student**: Mark attendance, submit logs, view feedback.
2. **Secretary**: Review all students, reply to updates, approve reports.
3. **Staff**: View dashboards and student performance.
4. **Admin**: Full system control.

## Project Structure
- `/server`: Node/Express API with Mongoose models.
- `/client`: Vite + React frontend with Tailwind CSS.

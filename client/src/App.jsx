import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DailyUpdates from './pages/DailyUpdates';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import StudentList from './pages/StudentList';
import ReviewUpdates from './pages/ReviewUpdates';
import ReviewReports from './pages/ReviewReports';
import ManageAttendance from './pages/ManageAttendance';
import ManageUsers from './pages/ManageUsers';
import Analytics from './pages/Analytics';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/updates" element={<DailyUpdates />} />
            <Route path="/reports" element={<Reports />} />

            {/* Secretary & Shared Routes */}
            <Route path="/students" element={<StudentList />} />
            <Route path="/manage-attendance" element={<ManageAttendance />} />
            <Route path="/manage-updates" element={<ReviewUpdates />} />
            <Route path="/manage-reports" element={<ReviewReports />} />

            {/* Admin Routes */}
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Staff Routes */}
            <Route path="/students-list" element={<StudentList />} />
            <Route path="/attendance-report" element={<ManageAttendance />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

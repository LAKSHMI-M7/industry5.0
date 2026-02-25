import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DailyUpdates from './pages/DailyUpdates';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Events from './pages/Events';
import StudentList from './pages/StudentList';
import ReviewUpdates from './pages/ReviewUpdates';
import ReviewReports from './pages/ReviewReports';
import ManageAttendance from './pages/ManageAttendance';
import ManageUsers from './pages/ManageUsers';
import Analytics from './pages/Analytics';
import StaffDashboard from './pages/StaffDashboard';
import StudentPortfolio from './pages/StudentPortfolio';
import ChangePassword from './pages/ChangePassword';
import Posters from './pages/Posters';
import ClubNotices from './pages/ClubNotices';
import AboutClub from './pages/AboutClub';
import EditClubInfo from './pages/EditClubInfo';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/updates" element={<DailyUpdates />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/events" element={<Events />} />

            {/* Secretary & Shared Routes */}
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:userId" element={<StudentPortfolio />} />
            <Route path="/manage-attendance" element={<ManageAttendance />} />
            <Route path="/manage-updates" element={<ReviewUpdates />} />
            <Route path="/manage-reports" element={<ReviewReports />} />

            {/* Admin Routes */}
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Staff Routes */}
            <Route path="/students-list" element={<StudentList />} />
            <Route path="/attendance-report" element={<ManageAttendance />} />

            {/* Poster Routes */}
            <Route path="/posters" element={<Posters />} />
            <Route path="/club-notices" element={<ClubNotices />} />

            {/* Club Info Routes */}
            <Route path="/about-club" element={<AboutClub />} />
            <Route path="/edit-club" element={<EditClubInfo />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

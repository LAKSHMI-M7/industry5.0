import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    CalendarCheck,
    FileText,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout, currentRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const routes = {
        student: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/profile', name: 'Profile', icon: <UserCircle size={20} /> },
            { path: '/attendance', name: 'Attendance', icon: <CalendarCheck size={20} /> },
            { path: '/updates', name: 'Daily Updates', icon: <FileText size={20} /> },
            { path: '/reports', name: 'Weekly Reports', icon: <ClipboardList size={20} /> },
        ],
        secretary: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/students', name: 'Students', icon: <UserCircle size={20} /> },
            { path: '/manage-attendance', name: 'Attendance', icon: <CalendarCheck size={20} /> },
            { path: '/manage-updates', name: 'Review Updates', icon: <FileText size={20} /> },
            { path: '/manage-reports', name: 'Review Reports', icon: <ClipboardList size={20} /> },
        ],
        staff: [
            { path: '/dashboard', name: 'Stats Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/students-list', name: 'Student Directory', icon: <UserCircle size={20} /> },
            { path: '/attendance-report', name: 'Attendance Stats', icon: <CalendarCheck size={20} /> },
        ],
        admin: [
            { path: '/dashboard', name: 'Admin Control', icon: <LayoutDashboard size={20} /> },
            { path: '/manage-users', name: 'User Management', icon: <UserCircle size={20} /> },
            { path: '/analytics', name: 'System Analytics', icon: <ClipboardList size={20} /> },
        ]
    };

    // Use currentRole if available, fallback to user.role, default to []
    const roleToUse = currentRole || user?.role;
    const activeRoutes = routes[roleToUse] || [];

    return (
        <aside className="w-64 h-screen bg-secondary/50 border-r border-white/10 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-accent">I5C Platform</h1>
                <p className="text-xs text-slate-400 mt-1">Industry 5.0 Club</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {activeRoutes.map((route) => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        {route.icon}
                        <span>{route.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 mb-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full sidebar-link text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

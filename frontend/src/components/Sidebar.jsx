import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCircle,
    CalendarCheck,
    FileText,
    ClipboardList,
    LogOut,
    Shield,
    Trophy,
    Bell,
    Megaphone,
    Info,
    Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const Sidebar = () => {
    const { user, logout, currentRole, isAuthenticating } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // UI Logic for Profile Section
    const renderProfileSection = () => {
        if (isAuthenticating || !user) {
            return (
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 mb-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-white/20" />
                    <div className="space-y-2 flex-1">
                        <div className="h-2 w-16 bg-white/20 rounded-full" />
                        <div className="h-2 w-10 bg-white/10 rounded-full" />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/50 mb-2 transition-all duration-300 hover:bg-white border border-slate-200/50">
                <div className="relative flex-shrink-0">
                    <img
                        src={getImageUrl(user?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=92400E&color=fff&bold=true`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#F1F5F9] rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate leading-none mb-1">{user?.name}</p>
                    <p className="text-[9px] text-slate-500 font-black leading-none">{user?.role}</p>
                </div>
            </div>
        );
    };

    const routes = {
        student: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { path: '/profile', name: 'Profile', icon: <UserCircle size={18} /> },
            { path: '/attendance', name: 'Attendance', icon: <CalendarCheck size={18} /> },
            { path: '/updates', name: 'Daily Updates', icon: <FileText size={18} /> },
            { path: '/reports', name: 'Weekly Reports', icon: <ClipboardList size={18} /> },
            { path: '/events', name: 'Events / Activities', icon: <Trophy size={18} /> },
            { path: '/club-notices', name: 'Club Notices', icon: <Bell size={18} /> },
            { path: '/about-club', name: 'About Club', icon: <Info size={18} /> },
        ],
        secretary: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { path: '/students', name: 'Students', icon: <UserCircle size={18} /> },
            { path: '/manage-attendance', name: 'Attendance', icon: <CalendarCheck size={18} /> },
            { path: '/manage-updates', name: 'Daily Updates', icon: <FileText size={18} /> },
            { path: '/manage-reports', name: 'Weekly Reports', icon: <ClipboardList size={18} /> },
            { path: '/about-club', name: 'About Club', icon: <Info size={18} /> },
        ],
        staff: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { path: '/students', name: 'Students', icon: <UserCircle size={18} /> },
            { path: '/attendance-report', name: 'Attendance', icon: <CalendarCheck size={18} /> },
            { path: '/about-club', name: 'About Club', icon: <Info size={18} /> },
        ],
        chairperson: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { path: '/students', name: 'Students', icon: <UserCircle size={18} /> },
            { path: '/manage-attendance', name: 'Attendance', icon: <CalendarCheck size={18} /> },
            { path: '/manage-updates', name: 'Daily Updates', icon: <FileText size={18} /> },
            { path: '/manage-reports', name: 'Weekly Reports', icon: <ClipboardList size={18} /> },
            { path: '/posters', name: 'Posters', icon: <Megaphone size={18} /> },
            { path: '/about-club', name: 'About Club', icon: <Info size={18} /> },
        ],
        admin: [
            { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { path: '/manage-users', name: 'Manage Users', icon: <UserCircle size={18} /> },
            { path: '/analytics', name: 'Reports', icon: <ClipboardList size={18} /> },
            { path: '/edit-club', name: 'Edit Club Info', icon: <Settings size={18} /> },
            { path: '/about-club', name: 'About Club', icon: <Info size={18} /> },
        ]
    };

    const roleToUse = currentRole || user?.role || 'student';
    const activeRoutes = routes[roleToUse] || [];

    return (
        <aside className="w-64 h-screen bg-[#F1F5F9] flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200 overflow-hidden font-['Outfit']">
            {/* Logo Section */}
            <div className="p-6 pb-2 erp-logo-section">
                <div className="flex items-center space-x-3 mb-2">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className="w-10 h-10 rounded-full object-cover shadow-md border border-white bg-white flex-shrink-0"
                    />
                    <h1 className="text-lg font-black text-slate-900 leading-none">I5C Hub</h1>
                </div>
                <div className="h-0.5 w-8 bg-[#92400E]/20 rounded-full"></div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 px-4 mt-6 erp-nav-section select-none">
                <p className="px-3 text-[9px] font-black text-slate-400 mb-4 opacity-50">University Matrix</p>
                <nav className="space-y-1">
                    {activeRoutes.map((route) => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 group erp-nav-item ${isActive
                                    ? 'bg-[#9A4A17] text-white shadow-lg shadow-amber-900/20 font-bold'
                                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                }`
                            }
                        >
                            <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">
                                {route.icon}
                            </div>
                            <span className="text-xs font-bold">{route.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Footer Section: Profile + Sign Out */}
            <div className="p-4 mt-auto border-t border-slate-200/60 bg-slate-200/30">
                {renderProfileSection()}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 erp-nav-item rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-xs font-black">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

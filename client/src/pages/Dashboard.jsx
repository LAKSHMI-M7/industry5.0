import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard = () => {
    const { user, currentRole, switchRole } = useAuth();

    // Use currentRole from context (which defaults to user.role)
    // If for some reason currentRole is null/undefined, use user.role as fallback
    const roleToRender = currentRole || user?.role;

    const renderDashboard = () => {
        switch (roleToRender) {
            case 'student':
                return <StudentDashboard />;
            case 'secretary':
                return <SecretaryDashboard />;
            case 'admin':
                return <AdminDashboard />;
            case 'staff':
                return <StaffDashboard />;
            default:
                return (
                    <div className="flex items-center justify-center h-[70vh]">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">🚧</div>
                            <h1 className="text-3xl font-bold">Unrecognized Role</h1>
                            <p className="text-slate-400">Please contact the administrator to assign a valid role.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="relative">
            {/* Role Switcher for Multi-Role Users */}
            {user?.allowedRoles && user.allowedRoles.length > 1 && (
                <div className="fixed top-24 right-6 z-50 bg-slate-800/90 backdrop-blur border border-white/10 p-2 rounded-xl shadow-2xl flex space-x-2 animate-in fade-in slide-in-from-top-4">
                    {user.allowedRoles.includes('student') && (
                        <button
                            onClick={() => switchRole('student')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${roleToRender === 'student'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'hover:bg-white/5 text-slate-300'
                                }`}
                        >
                            Student View
                        </button>
                    )}
                    {user.allowedRoles.includes('secretary') && (
                        <button
                            onClick={() => switchRole('secretary')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${roleToRender === 'secretary'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                    : 'hover:bg-white/5 text-slate-300'
                                }`}
                        >
                            Secretary View
                        </button>
                    )}
                </div>
            )}

            {renderDashboard()}
        </div>
    );
};

export default Dashboard;

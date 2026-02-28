import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Shield,
    Activity,
    FileText,
    UserCheck,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats');
                setStats(data);
            } catch (err) {
                console.error('Error fetching admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="bg-[#ECECEC] min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
            <div className="relative">
                <div className="w-24 h-24 border-8 border-amber-100/20 border-t-[#9A4A17] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full animate-pulse" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-[4px] animate-pulse">Loading Dashboard...</p>
        </div>

    );

    const highlightCards = [
        {
            label: "Today's Attendance",
            value: stats?.activity?.attendanceToday || 0,
            subtitle: "Present Students Today",
            icon: <UserCheck size={32} />,
            isPrimary: true,
            path: '/analytics'
        },
        {
            label: "Active Users Today",
            value: stats?.users?.activeToday || 0,
            subtitle: "Total Portal Logins",
            icon: <Shield size={32} />,
            isPrimary: false,
            path: '/manage-users'
        }
    ];

    const secondaryCards = [
        { label: "Total Students", value: stats?.users?.students || 0, icon: <Users size={20} />, path: '/manage-users' },
        { label: "Absent Students Today", value: stats?.activity?.absentToday || 0, icon: <AlertCircle size={20} />, path: '/analytics' },
        { label: "Daily Updates Pending", value: stats?.activity?.pendingDailyUpdates || 0, icon: <Activity size={20} />, path: '/manage-updates' },
        { label: "Weekly Reports Pending", value: stats?.activity?.pendingWeeklyReports || 0, icon: <FileText size={20} />, path: '/manage-reports' },
    ];

    return (
        <div className="bg-[#ECECEC] min-h-screen p-8 md:p-12 font-['Outfit'] overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-10 pb-24">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Administrator Dashboard</h1>
                        <p className="text-slate-500 font-bold tracking-widest text-xs opacity-70">
                            Manage students, attendance, and activity reports
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sm flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-slate-900 font-black tracking-[2px] text-[9px]">System Active</span>
                        </div>
                    </div>

                </header>

                {/* Top Section - Large Highlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {highlightCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => navigate(card.path)}
                            className={`relative overflow-hidden p-10 rounded-[32px] cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${card.isPrimary
                                    ? 'bg-gradient-to-br from-[#9A4A17] to-[#7A3811] text-white'
                                    : 'bg-white border border-[#E5E7EB] text-slate-900 shadow-sm'
                                }`}
                        >
                            <div className={`mb-6 opacity-80 ${card.isPrimary ? 'text-white/40' : 'text-[#9A4A17]'}`}>
                                {card.icon}
                            </div>
                            <div className="relative z-10">
                                <p className={`text-[11px] font-black uppercase tracking-[3px] mb-2 ${card.isPrimary ? 'text-white/60' : 'text-slate-400'}`}>
                                    {card.label}
                                </p>
                                <h2 className="text-6xl font-black tracking-tighter mb-2 leading-none">
                                    {card.value}
                                </h2>
                                <p className={`text-sm font-bold uppercase tracking-widest ${card.isPrimary ? 'text-white/40' : 'text-slate-400'}`}>
                                    {card.subtitle}
                                </p>
                            </div>
                            {card.isPrimary && (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Second Section - Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {secondaryCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            onClick={() => navigate(card.path)}
                            className="bg-white p-8 rounded-[18px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                        >
                            <div className="text-[#9A4A17] mb-6 transition-transform group-hover:scale-110">
                                {card.icon}
                            </div>
                            <div className="flex-grow">
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[2px] mb-2 leading-none">
                                    {card.label}
                                </p>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                                    {card.value}
                                </h3>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-[#9A4A17] uppercase tracking-widest">View Details</span>
                                <ChevronRight size={12} className="text-[#9A4A17]" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-10 rounded-[28px] border border-[#E5E7EB] shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Recent Dashboard Activity</h3>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest">Recent administrative updates</p>
                            </div>
                            <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <span className="text-[9px] font-bold text-slate-400 tracking-widest">Live Updates</span>
                            </div>

                        </div>
                        <div className="space-y-4">
                            {[
                                { user: 'Secretary Panel', action: 'Daily Update Verified', time: '12s ago' },
                                { user: 'Admin Root', action: 'User Permissions Modified', time: '5m ago' },
                                { user: 'System Sync', action: 'Attendance Records Normalized', time: '18m ago' }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                            <Activity size={14} className="text-[#9A4A17]" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase">{log.user}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{log.action}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[28px] border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 w-fit mb-6 text-[#9A4A17]">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 text-left">Data Privacy & Guidelines</h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed">
                                This dashboard is restricted to authorized administrative personnel. All activities are recorded for security purposes.
                            </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-[9px] font-black text-[#9A4A17] tracking-[2px]">Authorized Access Only</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

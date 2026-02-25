import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Calendar,
    FileText,
    ClipboardList,
    ArrowRight,
    Search,
    Clock,
    Activity,
    Cpu,
    CheckCircle2,
    XCircle,
    UserCircle,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SecretaryDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/secretary/stats');
                setStats(data);
            } catch (err) {
                console.error('Error fetching secretary stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (loading) return (
        <div className="bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center p-8 font-['Outfit']">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
                <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#92400E] animate-pulse" />
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[6px] animate-pulse text-center">
                System Registry<br /><span className="mt-2 block opacity-50">Initializing Secretary Panel</span>
            </p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-['Outfit']">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase mb-3">Secretary Dashboard</h1>
                    <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm opacity-70">
                        Manage attendance and verify student submissions
                    </p>
                </div>

                <div className="bg-white px-8 py-4 rounded-[24px] border border-slate-200 shadow-sm flex items-center space-x-6">
                    <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Clock</p>
                        <p className="text-slate-900 font-black text-sm uppercase tracking-tighter">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#92400E]/10 flex items-center justify-center text-[#92400E]">
                            <Activity size={20} />
                        </div>
                        <span className="text-slate-900 font-black uppercase tracking-[3px] text-[10px]">Secretary View</span>
                    </div>
                </div>
            </header>

            {/* Top Priority Cards (Large Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Today's Attendance Status */}
                <motion.div
                    whileHover={{ translateY: -5 }}
                    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-blue-50 text-blue-600 p-5 rounded-[24px]">
                            <Calendar size={28} />
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live Sync</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Attendance Status</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[2px] mb-1">Present</p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats?.attendance?.present || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[2px] mb-1">Absent</p>
                            <p className="text-3xl font-black text-red-600 tracking-tighter">{stats?.attendance?.absent || 0}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/manage-attendance')}
                        className="w-full bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 transition-all uppercase text-[10px] tracking-[3px] shadow-xl shadow-slate-900/10"
                    >
                        <span>View Attendance List</span>
                        <ArrowRight size={18} />
                    </button>
                </motion.div>

                {/* 2. Pending Daily Updates */}
                <motion.div
                    whileHover={{ translateY: -5 }}
                    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-purple-50 text-purple-600 p-5 rounded-[24px]">
                            <FileText size={28} />
                        </div>
                        {stats?.updates?.pending > 0 && (
                            <div className="animate-pulse">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">Needs Action</span>
                            </div>
                        )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Daily Journals</h3>
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Pending Submission</p>
                        <div className="flex items-center space-x-4">
                            <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats?.updates?.noUpdateCount || 0}</p>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Students today</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/manage-updates')}
                        className="w-full bg-[#92400E] hover:bg-[#78350F] text-white px-8 py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 transition-all uppercase text-[10px] tracking-[3px] shadow-xl shadow-amber-900/10"
                    >
                        <span>Review Updates</span>
                        <ArrowRight size={18} />
                    </button>
                </motion.div>

                {/* 3. Pending Weekly Reports */}
                <motion.div
                    whileHover={{ translateY: -5 }}
                    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-amber-50 text-amber-600 p-5 rounded-[24px]">
                            <ClipboardList size={28} />
                        </div>
                        {stats?.reports?.pending > 0 && (
                            <div className="animate-bounce">
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200">Awaiting Verification</span>
                            </div>
                        )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Weekly Verification</h3>
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-8">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Reports in Queue</p>
                        <div className="flex items-center space-x-4">
                            <p className="text-5xl font-black text-slate-900 tracking-tighter">{stats?.reports?.pending || 0}</p>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reports Pending</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/manage-reports')}
                        className="w-full bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 transition-all uppercase text-[10px] tracking-[3px] shadow-xl shadow-slate-900/10"
                    >
                        <span>Verify Reports</span>
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </div>

            {/* Second Row (Medium Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 4. Students Without Attendance Today */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                            <UserCircle size={20} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Attendance Today</h4>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stats?.attendance?.absent || 0}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Students marked as absent</p>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                        <button onClick={() => navigate('/manage-attendance')} className="text-[#92400E] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
                            View List <ArrowRight size={12} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* 5. Students Without Weekly Report */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <AlertCircle size={20} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">No Weekly Report</h4>
                    </div>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stats?.reports?.noReportCount || 0}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Missing this week's data</p>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                        <button onClick={() => navigate('/manage-reports')} className="text-[#92400E] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
                            Audit Reports <ArrowRight size={12} className="ml-1" />
                        </button>
                    </div>
                </div>

                {/* 6. Recently Submitted Reports */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recently Submitted</h4>
                    </div>
                    <div className="space-y-4">
                        {stats?.reports?.recent?.length > 0 ? stats.reports.recent.slice(0, 2).map((r, i) => (
                            <div key={i} className="flex justify-between items-center text-[11px]">
                                <span className="font-bold text-slate-600 truncate max-w-[120px] uppercase tracking-tight">{r.user?.name}</span>
                                <span className="text-slate-400 font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                        )) : (
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest text-center py-4">No recent submissions</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Students Requiring Action Table */}
            <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl overflow-hidden relative group">
                <div className="p-10 md:p-12 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Students Requiring Action</h3>
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1 italic">Identity audit flagging incomplete mandatory activities</p>
                    </div>
                    <div className="relative group/search">
                        <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#92400E] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search action items..."
                            className="pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold focus:outline-none focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all w-full md:w-96 shadow-inner"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Student Name</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Department</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Issue Flag</th>
                                <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Date</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats?.actionItems?.length > 0 ? stats.actionItems.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-all duration-300 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#92400E] font-black text-sm border-2 border-white shadow-sm overflow-hidden">
                                                <img
                                                    src={item.student?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.student?.name || 'S')}&background=92400E&color=fff&bold=true`}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{item.student?.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border border-slate-200/50">
                                            {item.department || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className={`text-[9px] font-black uppercase tracking-[2px] px-4 py-2 rounded-full border shadow-sm ${item.issue === 'Absent' ? 'bg-red-50 text-red-600 border-red-100' :
                                                item.issue === 'No Daily Update' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {item.issue}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-xs font-black text-slate-400 uppercase tracking-tighter">
                                        {new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button
                                            onClick={() => navigate(item.issue === 'Absent' ? '/manage-attendance' : item.issue === 'No Daily Update' ? '/manage-updates' : '/manage-reports')}
                                            className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-xl transition-all"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <CheckCircle2 size={64} className="mx-auto text-emerald-100 mb-6" />
                                        <p className="text-slate-400 font-bold uppercase tracking-[4px]">No critical actions required today.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Global Legend / Status Info */}
            <div className="flex justify-center space-x-12 pt-8">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verification</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rejected / Needs Review</span>
                </div>
            </div>
        </div>
    );
};

export default SecretaryDashboard;

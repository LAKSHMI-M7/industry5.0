import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    UserCheck,
    AlertCircle,
    FileText,
    Activity,
    ClipboardCheck,
    ChevronRight,
    Clock,
    Search,
    ShieldCheck,
    XCircle,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ChairpersonDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [studentMap, setStudentMap] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, studentsRes, updatesRes, reportsRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/secretary/students'),
                    axios.get('/api/secretary/updates'),
                    axios.get('/api/secretary/reports')
                ]);

                setStats(statsRes.data);

                // Create a map for user ID to department
                const smap = {};
                studentsRes.data.forEach(s => {
                    if (s.user && s.user._id) {
                        smap[s.user._id] = s.department || 'N/A';
                    }
                });
                setStudentMap(smap);

                const allSubmissions = [
                    ...updatesRes.data.map(u => ({ ...u, type: 'Daily' })),
                    ...reportsRes.data.map(r => ({ ...r, type: 'Weekly' }))
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

                setRecentSubmissions(allSubmissions);
            } catch (err) {
                console.error('Error fetching chairperson data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="bg-[#ECECEC] min-h-screen flex flex-col items-center justify-center p-8 font-['Outfit']">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#9A4A17]/20 border-t-[#9A4A17] rounded-full animate-spin"></div>
                <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#9A4A17] animate-pulse" />
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[6px] animate-pulse text-center">
                Institutional Academic Audit<br /><span className="mt-2 block opacity-50">Initializing Chairperson Panel</span>
            </p>
        </div>
    );

    const cards = [
        { label: "Total Enrollment", value: stats?.users?.students || 0, icon: <Users size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Present Today", value: stats?.activity?.attendanceToday || 0, icon: <ShieldCheck size={24} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Absent Today", value: stats?.activity?.absentToday || 0, icon: <XCircle size={24} />, color: "text-red-600", bg: "bg-red-50" },
        { label: "Pending Reports", value: stats?.activity?.pendingWeeklyReports || 0, icon: <FileText size={24} />, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Daily Journals", value: stats?.activity?.pendingDailyUpdates || 0, icon: <Activity size={24} />, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Awaiting Verification", value: stats?.activity?.approvedWeeklyReports || 0, icon: <ShieldCheck size={24} />, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    return (
        <div className="min-h-screen bg-[#ECECEC] p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-[6px] mb-3 leading-none">Jeppiaar Institute OF Technology</p>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase">Chairperson Dashboard</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs opacity-70">
                            Academic Monitoring and Student Portfolio Verification
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-white px-8 py-4 rounded-[24px] border border-slate-200 shadow-sm flex items-center space-x-4">
                            <Clock size={20} className="text-[#9A4A17]" />
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Census Date</p>
                                <p className="text-slate-900 font-black text-sm uppercase tracking-tighter">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-xl hover:shadow-2xl transition-all group cursor-default relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-colors group-hover:bg-slate-100"></div>
                            <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110 shadow-sm`}>
                                {card.icon}
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[2px] mb-2">{card.label}</p>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Submissions Table */}
                <div className="bg-white rounded-[56px] border border-slate-200 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#9A4A17]/5 opacity-50 pointer-events-none"></div>
                    <div className="p-10 md:p-12 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Academic Activity</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unified stream of student logs awaiting institutional verification</p>
                        </div>
                        <div className="relative group/search">
                            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#9A4A17] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search repository..."
                                className="pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold focus:outline-none focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] transition-all w-full md:w-96 shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Scholar Identification</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Department</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Activity Type</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Timestamp</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Audit Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px] text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentSubmissions.map((sub, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-all duration-300 group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center space-x-5">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#9A4A17] font-black text-lg border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                                                    <img
                                                        src={sub.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{sub.user?.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="text-[10px] font-black text-[#9A4A17] uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full border border-amber-100/30">
                                                {studentMap[sub.user?._id] || 'ECE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`text-[9px] font-black uppercase tracking-[2px] px-4 py-2 rounded-full border shadow-sm ${sub.type === 'Weekly' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {sub.type} Report
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="text-xs font-black text-slate-600 uppercase tracking-tighter">{new Date(sub.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm border ${sub.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    sub.status === 'Approved' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        sub.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {sub.status || 'Pending Review'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => navigate(sub.type === 'Weekly' ? '/manage-reports' : '/manage-updates')}
                                                    className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#9A4A17] hover:text-white hover:border-[#9A4A17] hover:shadow-xl hover:shadow-amber-900/20 transition-all group/btn"
                                                    title="Verify Submission"
                                                >
                                                    <ChevronRight size={22} className="transition-transform group-hover/btn:translate-x-1" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {recentSubmissions.length === 0 && (
                        <div className="py-24 text-center">
                            <Activity size={64} className="mx-auto text-slate-100 mb-6 animate-pulse" />
                            <p className="text-slate-400 font-bold uppercase tracking-[4px]">No audit logs available for verification.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChairpersonDashboard;

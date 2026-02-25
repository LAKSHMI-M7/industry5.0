import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Github,
    Linkedin,
    FileText,
    ClipboardList,
    ShieldCheck,
    Zap,
    Cpu,
    Activity,
    LogOut,
    User,
    Award,
    Bell,
    Eye,
    Check,
    Instagram,
    ExternalLink,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        attendance: 0,
        updatesCount: 0,
        reportsCount: 0
    });
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);
    const [latestPoster, setLatestPoster] = useState(null);
    const [clubLinks, setClubLinks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markingAttendance, setMarkingAttendance] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch attendance, profile, updates, reports, and posters
                const [attRes, updateRes, reportRes, profileRes, posterRes, clubRes] = await Promise.all([
                    axios.get('/api/student/attendance'),
                    axios.get('/api/student/daily-update'),
                    axios.get('/api/student/weekly-report'),
                    axios.get('/api/student/profile'),
                    axios.get('/api/posters/latest').catch(() => ({ data: null })),
                    axios.get('/api/club-info').catch(() => ({ data: null }))
                ]);

                setProfile(profileRes.data);
                if (posterRes.data) setLatestPoster(posterRes.data);
                if (clubRes?.data) setClubLinks(clubRes.data);

                // Calculate attendance percentage (assuming 30 days total for demo)
                const attendanceData = attRes.data || [];
                const presentDays = attendanceData.filter(a => a.status === 'Present').length;

                setStats({
                    attendance: attendanceData.length > 0 ? (presentDays / 30 * 100).toFixed(1) : 0,
                    updatesCount: updateRes.data.length,
                    reportsCount: reportRes.data.length
                });

                // Activity logic
                const updates = updateRes.data.map(u => ({
                    id: u._id,
                    type: 'Daily Update',
                    date: u.date,
                    status: u.status || 'Pending',
                    color: '#92400E'
                }));

                const reports = reportRes.data.map(r => ({
                    id: r._id,
                    type: 'Weekly Report',
                    date: r.createdAt,
                    status: r.status === 'Verified' ? 'Approved' : r.status,
                    color: '#0F172A'
                }));

                const combined = [...updates, ...reports]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);

                setRecentActivities(combined);

                // CHECK IF TODAY'S ATTENDANCE EXISTS
                const todayStr = new Date().toISOString().split('T')[0];
                const markedToday = attendanceData.some(a => {
                    const recordDate = new Date(a.date).toISOString().split('T')[0];
                    return recordDate === todayStr && a.status === 'Present';
                });

                setAttendanceMarked(markedToday);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const markAttendance = async () => {
        if (markingAttendance || attendanceMarked) return;

        setMarkingAttendance(true);
        try {
            const { data } = await axios.post('/api/student/attendance');
            if (data.success || data.status === 'Present') {
                setAttendanceMarked(true);
                // Refresh attendance stats locally
                const attRes = await axios.get('/api/student/attendance');
                const attendanceData = attRes.data || [];
                const presentDays = attendanceData.filter(a => a.status === 'Present').length;
                setStats(prev => ({ ...prev, attendance: (presentDays / 30 * 100).toFixed(1) }));
            }
        } catch (err) {
            console.error('Attendance marking failure:', err);
            alert(err.response?.data?.message || 'Failed to mark attendance. Please try again.');
        } finally {
            setMarkingAttendance(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-gradient min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
                    <Cpu size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#92400E] animate-pulse" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[6px] animate-pulse text-center">
                    Authenticating Node<br /><span className="text-[10px] mt-2 block opacity-50">Industrial Compliance Check</span>
                </p>
            </div>
        );
    }

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Nexus Dashboard</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm opacity-60">Welcome, {user?.name}. System status is operational.</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <AnimatePresence mode="wait">
                            {!attendanceMarked ? (
                                <motion.button
                                    key="mark-btn"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.05, translateY: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={markAttendance}
                                    disabled={markingAttendance}
                                    className="bg-slate-900 px-10 py-5 rounded-[28px] font-black shadow-2xl shadow-slate-900/20 hover:bg-black transition-all text-white flex items-center space-x-4 group uppercase tracking-widest text-[10px]"
                                >
                                    {markingAttendance ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ShieldCheck size={20} className="group-hover:text-amber-400 transition-colors" />
                                    )}
                                    <span>{markingAttendance ? 'Processing...' : 'Mark Present'}</span>
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="marked-badge"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-10 py-5 rounded-[28px] font-black flex items-center space-x-4 shadow-xl shadow-emerald-900/5 uppercase tracking-widest text-[10px]"
                                >
                                    <Check size={20} className="text-emerald-500" />
                                    <span>Attendance already marked</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Attendance', value: `${stats.attendance}%`, icon: <Calendar className="text-[#92400E]" />, trend: 'Registry Log', bg: 'bg-amber-50' },
                        { label: 'Daily Updates', value: stats.updatesCount, icon: <Cpu className="text-slate-600" />, trend: 'Journal Active', bg: 'bg-slate-100' },
                        { label: 'Weekly Reports', value: stats.reportsCount, icon: <Award className="text-[#92400E]" />, trend: 'Verification', bg: 'bg-amber-50' },
                        { label: 'Sync Status', value: 'Prime', icon: <Activity className="text-slate-600" />, trend: 'Protocol 100%', bg: 'bg-slate-100' },
                    ].map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={item.label}
                            className="glass-strong p-8 rounded-[40px] border-white shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`p-4 ${item.bg} rounded-[24px] shadow-sm group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white/80 px-4 py-2 rounded-full border border-slate-100">{item.trend}</span>
                            </div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[3px] ml-1 mb-2">{item.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{item.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Action Hub */}
                        <div className="glass-strong p-12 rounded-[56px] border-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#92400E]/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Operational Hub</h3>
                                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest opacity-60">Execute daily protocols and submit report logs</p>
                                </div>
                                <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Zap className="text-[#92400E] animate-bounce" size={24} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <button
                                    onClick={() => navigate('/updates')}
                                    className="group flex flex-col p-10 bg-white hover:bg-[#92400E] transition-all duration-700 border border-slate-100 rounded-[48px] shadow-xl hover:shadow-amber-900/30"
                                >
                                    <div className="w-16 h-16 bg-amber-50 group-hover:bg-white/20 rounded-[28px] flex items-center justify-center text-[#92400E] group-hover:text-white mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <FileText size={32} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-2xl text-slate-900 group-hover:text-white mb-3 tracking-tight uppercase leading-none">Daily Journal</p>
                                        <p className="text-[10px] text-slate-500 group-hover:text-white/80 font-black uppercase tracking-[2px]">Log Academic Updates</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="group flex flex-col p-10 bg-white hover:bg-slate-900 transition-all duration-700 border border-slate-100 rounded-[48px] shadow-xl hover:shadow-slate-900/30"
                                >
                                    <div className="w-16 h-16 bg-slate-50 group-hover:bg-white/20 rounded-[28px] flex items-center justify-center text-slate-900 group-hover:text-white mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                                        <ClipboardList size={32} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-2xl text-slate-900 group-hover:text-white mb-3 tracking-tight uppercase leading-none">Weekly Reports</p>
                                        <p className="text-[10px] text-slate-500 group-hover:text-white/80 font-black uppercase tracking-[2px]">Technical Submission</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="bg-white rounded-[56px] border border-slate-100 p-12 shadow-sm">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Recent Activity</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3 italic leading-none">Institutional ledger of submitted activities</p>
                                </div>
                                <button onClick={() => navigate('/attendance')} className="text-[9px] font-black uppercase tracking-[2px] text-[#92400E] border border-amber-100 bg-amber-50 px-6 py-3 rounded-full hover:bg-amber-100 transition-colors shadow-sm">Audit History</button>
                            </div>
                            <div className="space-y-6">
                                {recentActivities.length > 0 ? recentActivities.map((activity, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={activity.id}
                                        className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-110`} style={{ backgroundColor: activity.color }}>
                                                {activity.type === 'Daily Update' ? <FileText size={24} /> : <ClipboardList size={24} />}
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none">{activity.type}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mt-2 leading-none">{new Date(activity.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <span className={`text-[8px] font-black uppercase tracking-[3px] px-6 py-3 rounded-2xl border shadow-sm ${activity.status === 'Approved' || activity.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    activity.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {activity.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="py-24 text-center border-dashed border-2 border-slate-100 rounded-[48px]">
                                        <Clock size={48} className="mx-auto text-slate-100 mb-6" />
                                        <p className="text-slate-300 font-black tracking-[4px] uppercase text-[10px]">Registry is currently empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-12">
                        {/* Profile Module */}
                        <div className="glass-strong p-12 rounded-[56px] text-center border-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="relative inline-block mb-10">
                                    <div className="w-40 h-40 rounded-[42px] p-2 bg-white/60 backdrop-blur-md shadow-2xl mx-auto border border-white transform hover:rotate-3 transition-transform duration-500">
                                        <img
                                            src={profile?.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=92400E&color=fff&size=200&bold=true`}
                                            className="w-full h-full rounded-[36px] object-cover"
                                            alt={user?.name}
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl shadow-xl flex items-center justify-center">
                                        <ShieldCheck size={18} className="text-white" />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-2 leading-none tracking-tighter uppercase">{user?.name}</h4>
                                <p className="text-[10px] text-[#92400E] font-black uppercase tracking-[4px] mb-10">{profile?.domain || 'Research Candidate'}</p>

                                <button onClick={() => navigate('/profile')} className="w-full py-5 bg-slate-50 hover:bg-slate-900 border border-slate-100 rounded-[24px] text-slate-900 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-sm flex items-center justify-center space-x-3 group/btn">
                                    <User size={16} className="group-hover/btn:scale-110 transition-transform" />
                                    <span>Nexus Identity</span>
                                </button>
                            </div>
                        </div>

                        {/* Club Connect Card */}
                        <div className="glass p-10 rounded-[48px] border-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#92400E]/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Club Connect</h4>
                                <button onClick={() => navigate('/about-club')} className="p-2 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-colors">
                                    <Info size={14} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <a 
                                    href={clubLinks?.linkedin || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-sm"
                                >
                                    <Linkedin className="text-[#0A66C2] mb-3" size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">LinkedIn</span>
                                </a>
                                <a 
                                    href={`https://instagram.com/${clubLinks?.instagram || 'jit_industry5.0_club'}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-sm"
                                >
                                    <Instagram className="text-[#E4405F] mb-3" size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Instagram</span>
                                </a>
                            </div>
                        </div>

                        {/* Club Notice Poster */}
                        {latestPoster && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => navigate('/club-notices')}
                                className="glass-strong p-4 rounded-[42px] border-white shadow-xl cursor-pointer hover:shadow-2xl transition-all"
                            >
                                <img
                                    src={latestPoster.imageUrl}
                                    className="w-full h-48 object-cover rounded-[32px] mb-4 border border-slate-100"
                                    alt="Notice"
                                />
                                <div className="px-4 pb-4">
                                    <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2 line-clamp-2">{latestPoster.title}</h5>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Announcement Hub</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

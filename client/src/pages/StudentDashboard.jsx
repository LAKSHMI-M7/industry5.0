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
    ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [attRes, updateRes, reportRes, profileRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/student/attendance'),
                    axios.get('http://localhost:5000/api/student/daily-update'),
                    axios.get('http://localhost:5000/api/student/weekly-report'),
                    axios.get('http://localhost:5000/api/student/profile')
                ]);

                setProfile(profileRes.data);

                setStats({
                    attendance: (attRes.data.length / 30 * 100).toFixed(1),
                    updatesCount: updateRes.data.length,
                    reportsCount: reportRes.data.length
                });

                // Process Recent Activities
                const updates = updateRes.data.map(u => ({
                    id: u._id,
                    type: 'Daily Update',
                    date: u.date,
                    status: u.secretaryReply ? 'Reviewed' : 'Pending Review',
                    color: 'accent'
                }));

                const reports = reportRes.data.map(r => ({
                    id: r._id,
                    type: 'Weekly Report',
                    date: r.createdAt, // Using createdAt for reports
                    status: r.status,
                    color: 'green-500'
                }));

                const combined = [...updates, ...reports]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5); // Latest 5 activities

                setRecentActivities(combined);

                // Check if already marked today
                const today = new Date().toISOString().split('T')[0];
                const markedToday = attRes.data.some(a => a.date.startsWith(today));
                setAttendanceMarked(markedToday);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const markAttendance = async () => {
        try {
            await axios.post('http://localhost:5000/api/student/attendance');
            setAttendanceMarked(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error marking attendance');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <p className="text-slate-400">Track your progress and updates</p>
                </div>
                {!attendanceMarked ? (
                    <button
                        onClick={markAttendance}
                        className="bg-accent px-6 py-3 rounded-xl font-semibold shadow-lg shadow-accent/20 hover:scale-105 transition-all text-white flex items-center space-x-2"
                    >
                        <CheckCircle size={20} />
                        <span>Mark Attendance</span>
                    </button>
                ) : (
                    <div className="bg-green-500/10 text-green-500 border border-green-500/20 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2">
                        <CheckCircle size={20} />
                        <span>Present Today</span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Attendance', value: `${stats.attendance}%`, icon: <Calendar className="text-blue-400" />, trend: '+2%' },
                    { label: 'Daily Updates', value: stats.updatesCount, icon: <Clock className="text-purple-400" />, trend: 'This month' },
                    { label: 'Weekly Reports', value: stats.reportsCount, icon: <CheckCircle className="text-green-400" />, trend: 'Completed' },
                    { label: 'Performance', value: 'Good', icon: <TrendingUp className="text-orange-400" />, trend: 'Stable' },
                ].map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.label}
                        className="glass p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl">{item.icon}</div>
                            <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-lg">{item.trend}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/updates')}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">Submit Daily Update</p>
                                        <p className="text-xs text-slate-400">Share what you've done today</p>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/reports')}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500">
                                        <ClipboardList size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">Weekly Work Report</p>
                                        <p className="text-xs text-slate-400">Summarize your weekly progress</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivities.length > 0 ? recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-2 h-2 rounded-full ${activity.type === 'Daily Update' ? 'bg-accent' : 'bg-green-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.type} submitted</p>
                                            <p className="text-xs text-slate-500">{new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${activity.status === 'Reviewed' || activity.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-500 italic text-sm">
                                    No submissions yet. Start by submitting a daily update!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6">Profile Snapshot</h3>
                        <div className="text-center">
                            <img
                                src={profile?.user?.avatar || "/profile.jpg"}
                                className="w-24 h-24 rounded-2xl mx-auto mb-4 border-2 border-accent p-1 shadow-lg shadow-accent/20 object-cover"
                                alt={profile?.user?.name}
                            />
                            <h4 className="text-lg font-bold">{profile?.user?.name || user?.name}</h4>
                            <p className="text-sm text-slate-400 mb-6">{profile?.domain ? `${profile.domain} Domain` : 'Student Domain'}</p>

                            <div className="flex justify-center space-x-4">
                                <a
                                    href={profile?.githubLink || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 rounded-lg hover:text-accent transition-all"
                                >
                                    <Github size={20} />
                                </a>
                                <a
                                    href={profile?.linkedinLink || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/5 rounded-lg hover:text-accent transition-all"
                                >
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 p-6 rounded-2xl">
                        <h4 className="font-bold flex items-center space-x-2 mb-2">
                            <AlertCircle size={18} className="text-accent" />
                            <span>Secretary's Note</span>
                        </h4>
                        <p className="text-sm text-slate-300">"Great work on the last report! Keep focusing on the API integration part this week."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

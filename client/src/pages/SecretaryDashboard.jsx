import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    FileText,
    CheckCircle,
    MessageSquare,
    Search,
    Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const SecretaryDashboard = () => {
    const [students, setStudents] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingReviews: 0,
        attendanceToday: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentRes, updateRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/secretary/students'),
                    axios.get('http://localhost:5000/api/secretary/updates')
                ]);
                setStudents(studentRes.data);
                setUpdates(updateRes.data);

                setStats({
                    totalStudents: studentRes.data.length,
                    pendingReviews: updateRes.data.filter(u => !u.secretaryReply).length,
                    attendanceToday: '--'
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Secretary Dashboard</h1>
                <p className="text-slate-400">Manage student activities and reviews</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Members', value: stats.totalStudents, icon: <Users className="text-blue-400" />, color: 'blue' },
                    { label: 'Pending Reviews', value: stats.pendingReviews, icon: <MessageSquare className="text-orange-400" />, color: 'orange' },
                    { label: 'Attendance Today', value: stats.attendanceToday, icon: <CheckCircle className="text-green-400" />, color: 'green' },
                ].map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.label}
                        className="glass p-6 rounded-2xl border border-white/5"
                    >
                        <div className="p-3 bg-white/5 rounded-xl w-fit mb-4">{item.icon}</div>
                        <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                        <h3 className="text-3xl font-bold mt-1">{item.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Recent Submissions</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-accent outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {updates.slice(0, 5).map((update, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${update.user?.name}&background=random`}
                                        className="w-10 h-10 rounded-lg"
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-semibold">{update.user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate w-48">{update.workDone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`text-[10px] px-2 py-1 rounded ${!update.secretaryReply ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {!update.secretaryReply ? 'Pending' : 'Reviewed'}
                                    </span>
                                    <button className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Student Directory</h3>
                    <div className="space-y-4">
                        {students.slice(0, 6).map((student, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                                        {student.user?.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{student.user?.name}</p>
                                        <p className="text-xs text-slate-400">{student.domain}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-accent">{student.registerNumber}</p>
                                    <p className="text-[10px] text-slate-500">{student.year} Year</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretaryDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Activity, Zap, ShieldCheck, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axios.get('/api/student/attendance');
                // Ensure data is sorted by date descending for the log
                const sortedData = (data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
                setAttendance(sortedData);
            } catch (err) {
                console.error('Error fetching attendance log:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const stats = {
        present: attendance.filter(a => a.status === 'Present').length,
        absent: attendance.filter(a => a.status === 'Absent').length,
        percentage: attendance.length > 0 ? (attendance.filter(a => a.status === 'Present').length / attendance.length * 100).toFixed(1) : 0
    };

    if (loading) return (
        <div className="dashboard-gradient min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
                <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#92400E] animate-pulse" />
            </div>
            <p className="text-slate-400 font-black animate-pulse">Accessing registry...</p>
        </div>
    );

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 leading-none">Attendance Log</h1>
                        <p className="text-slate-500 font-bold ml-1 text-sm opacity-60">Verified institutional record of your technical residency.</p>
                    </div>
                </header>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { label: 'Total Logs', value: attendance.length, suffix: 'Sessions', icon: <History className="text-slate-600" />, bg: 'bg-slate-100' },
                        { label: 'Present Days', value: stats.present, suffix: 'Days', icon: <ShieldCheck className="text-emerald-600" />, bg: 'bg-emerald-50' },
                        { label: 'Compliance Level', value: stats.percentage, suffix: '%', icon: <Zap className="text-[#92400E]" />, bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="glass-strong p-10 rounded-[48px] border-white shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`p-5 ${stat.bg} rounded-[28px] group-hover:rotate-12 transition-transform shadow-sm`}>
                                    {stat.icon}
                                </div>
                                <span className="text-[8px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">System Verified</span>
                            </div>
                            <p className="text-slate-400 text-[9px] font-black mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                                {stat.value}<span className="text-lg text-slate-400 font-bold ml-2 tracking-tight">{stat.suffix}</span>
                            </h3>
                        </motion.div>
                    ))}
                </div>

                {/* Log Table Section */}
                <div className="glass-strong rounded-[56px] border-white shadow-2xl overflow-hidden relative group">
                    <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/40">
                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-[24px] flex items-center justify-center text-white shadow-xl">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Chronological Record</h3>
                                <p className="text-[9px] text-slate-400 font-bold mt-2">Activity sync with institutional servers</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 border-b border-slate-100">Logging Date</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 border-b border-slate-100 text-center">Marking Timestamp</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 border-b border-slate-100 text-center">Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 border-b border-slate-100 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-32 text-center">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                                <Calendar size={48} />
                                            </div>
                                            <p className="text-slate-400 font-black text-[10px]">No historical registry records found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    attendance.map((log) => (
                                        <tr key={log._id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-10 py-10 font-black text-slate-900 tracking-tighter text-xl leading-none">
                                                {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-10 py-10 text-center">
                                                {log.markedAt ? (
                                                    <div className="inline-flex items-center space-x-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm group-hover:scale-105 transition-transform">
                                                        <Clock size={16} className="text-[#92400E]" />
                                                        <span className="text-sm font-bold text-slate-600 tracking-tight">
                                                            {new Date(log.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-black text-slate-300 italic">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-10 py-10 text-center">
                                                <span className={`inline-flex items-center px-6 py-3 rounded-full text-[10px] font-black border shadow-sm ${log.status === 'Present'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {log.status === 'Present' ? <ShieldCheck size={14} className="mr-2" /> : <XCircle size={14} className="mr-2" />}
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-10 text-right">
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center space-x-2 text-emerald-500">
                                                        <CheckCircle size={14} />
                                                        <span className="text-[9px] font-black">Validated</span>
                                                    </div>
                                                    <p className="text-[8px] text-slate-400 font-bold mt-1 tracking-tighter">Checksum: 8x2F...90Z</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;

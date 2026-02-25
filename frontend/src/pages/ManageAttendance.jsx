import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, CheckCircle, XCircle, Clock, UserCheck, Activity, Users, ShieldCheck, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ManageAttendance = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentRes, attendanceRes] = await Promise.all([
                axios.get('/api/secretary/students'),
                axios.get(`/api/secretary/attendance/${selectedDate}`)
            ]);
            setStudents(studentRes.data);
            setAttendanceLogs(attendanceRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (userId, status) => {
        if (user?.role === 'chairperson') return;
        try {
            const { data } = await axios.post('/api/secretary/attendance/mark', {
                userId,
                date: selectedDate,
                status
            });

            // Update local state
            setAttendanceLogs(prev => {
                const existing = prev.find(a => a.user?._id === userId || a.user === userId);
                if (existing) {
                    return prev.map(a => (a.user?._id === userId || a.user === userId) ? data : a);
                }
                return [...prev, data];
            });
        } catch (err) {
            alert('Error marking attendance.');
        }
    };

    const getStatus = (userId) => {
        const log = attendanceLogs.find(a => a.user?._id === userId || a.user === userId);
        return log ? log.status : 'Not Marked';
    };

    const filteredStudents = students.filter(s =>
        s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registerNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#ECECEC] min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Attendance Repository</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">{user?.role === 'chairperson' ? 'High-level academic attendance monitoring and analytics.' : 'Track and manage student institutional attendance records.'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9A4A17] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-14 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold w-full sm:w-64 shadow-sm"
                            />
                        </div>
                        <div className="bg-white/60 p-1.5 rounded-[28px] border border-slate-200/60 flex items-center shadow-sm">
                            <div className="px-5 text-[#9A4A17]"><Calendar size={20} /></div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent text-slate-900 px-4 py-3 outline-none font-black uppercase text-xs tracking-widest border-l border-slate-100"
                            />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { label: 'Cumulative Present', value: attendanceLogs.filter(a => a.status === 'Present').length, suffix: 'Scholars', icon: <ShieldCheck className="text-emerald-600" />, bg: 'bg-emerald-50' },
                        { label: 'Cumulative Absent', value: attendanceLogs.filter(a => a.status === 'Absent').length, suffix: 'Scholars', icon: <Activity className="text-red-600" />, bg: 'bg-red-50' },
                        { label: 'Total Enrollment', value: students.length, suffix: 'Members', icon: <Users className="text-[#9A4A17]" />, bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-5 ${stat.bg} rounded-[24px]`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                                {stat.value} <span className="text-lg text-slate-400 font-bold ml-1">{stat.suffix}</span>
                            </h3>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-[56px] border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[3px] uppercase">Scholar Identification</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[3px] uppercase">Verification Status</th>
                                    {user?.role !== 'chairperson' && (
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[3px] uppercase text-right">Attendance Control</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={user?.role === 'chairperson' ? 2 : 3} className="px-10 py-32 text-center text-slate-400 uppercase font-black text-xs tracking-widest">No student metrics found in repository</td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const status = getStatus(student.user?._id);
                                        return (
                                            <tr key={student._id} className="hover:bg-slate-50 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="relative">
                                                            <img
                                                                src={student.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                                                alt="Avatar"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase mb-1">{student.user?.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">REG: {student.registerNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`inline-flex items-center px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        status === 'Absent' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        {status === 'Present' ? 'Present' : status === 'Absent' ? 'Absent' : 'Pending Verification'}
                                                    </span>
                                                </td>
                                                {user?.role !== 'chairperson' && (
                                                    <td className="px-10 py-8">
                                                        <div className="flex justify-end space-x-3">
                                                            <button
                                                                onClick={() => markAttendance(student.user?._id, 'Present')}
                                                                className={`p-4 rounded-2xl transition-all ${status === 'Present'
                                                                    ? 'bg-[#9A4A17] text-white shadow-xl shadow-amber-900/30'
                                                                    : 'bg-white border border-slate-200 text-slate-400 hover:text-[#9A4A17] hover:bg-amber-50 shadow-sm'
                                                                    }`}
                                                                title="Mark Present"
                                                            >
                                                                <CheckCircle size={24} />
                                                            </button>
                                                            <button
                                                                onClick={() => markAttendance(student.user?._id, 'Absent')}
                                                                className={`p-4 rounded-2xl transition-all ${status === 'Absent'
                                                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30'
                                                                    : 'bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm'
                                                                    }`}
                                                                title="Mark Absent"
                                                            >
                                                                <XCircle size={24} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAttendance;

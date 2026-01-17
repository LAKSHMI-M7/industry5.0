import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/attendance');
                setAttendance(data);
            } catch (err) {
                console.error(err);
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

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Attendance Record</h1>
                <p className="text-slate-400">Monitor your daily presence logs</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Total Days Logged</p>
                    <h3 className="text-3xl font-bold mt-1">{attendance.length} Days</h3>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Days Present</p>
                    <h3 className="text-3xl font-bold mt-1 text-green-500">{stats.present}</h3>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Attendance Percentage</p>
                    <h3 className="text-3xl font-bold mt-1 text-accent">{stats.percentage}%</h3>
                </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Recent Logs</h3>
                    <div className="flex space-x-2">
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ChevronLeft size={18} /></button>
                        <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ChevronRight size={18} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">DATE</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">TIME</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">STATUS</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">REMARK</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {attendance.map((log) => (
                                <tr key={log._id} className="hover:bg-white/5 transition-all">
                                    <td className="px-6 py-4 font-medium">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <Clock size={14} />
                                            <span>{new Date(log.date).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === 'Present' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {log.status === 'Present' ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 italic text-sm">Automated Log</td>
                                </tr>
                            ))}
                            {attendance.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">No attendance records found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ManageAttendance = () => {
    const [students, setStudents] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentRes, attendanceRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/secretary/students'),
                    axios.get(`http://localhost:5000/api/secretary/attendance/${selectedDate}`)
                ]);
                setStudents(studentRes.data);
                setAttendanceLogs(attendanceRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDate]);

    const markAttendance = async (userId, status) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/secretary/attendance/mark', {
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
            alert('Error marking attendance');
        }
    };

    const getStatus = (userId) => {
        const log = attendanceLogs.find(a => a.user?._id === userId || a.user === userId);
        return log ? log.status : 'Not Marked';
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Manage Attendance</h1>
                    <p className="text-slate-400">Track and update club member presence</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white px-4 py-2 outline-none [color-scheme:dark]"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Present Today</p>
                    <h3 className="text-3xl font-bold mt-1 text-green-500">
                        {attendanceLogs.filter(a => a.status === 'Present').length}
                    </h3>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Absent Today</p>
                    <h3 className="text-3xl font-bold mt-1 text-red-500">
                        {attendanceLogs.filter(a => a.status === 'Absent').length}
                    </h3>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">Total Members</p>
                    <h3 className="text-3xl font-bold mt-1 text-accent">{students.length}</h3>
                </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">STUDENT</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">STATUS</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student) => {
                                const status = getStatus(student.user?._id);
                                return (
                                    <tr key={student._id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent font-bold">
                                                    {student.user?.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{student.user?.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono text-[10px]">{student.registerNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${status === 'Present' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    status === 'Absent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => markAttendance(student.user?._id, 'Present')}
                                                    className={`p-2 rounded-lg transition-all ${status === 'Present' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 text-slate-400 hover:text-green-500 hover:bg-green-500/10'}`}
                                                    title="Mark Present"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => markAttendance(student.user?._id, 'Absent')}
                                                    className={`p-2 rounded-lg transition-all ${status === 'Absent' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10'}`}
                                                    title="Mark Absent"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageAttendance;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Mail, ExternalLink, Filter, X, ChevronRight, UserPlus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get('/api/secretary/students');
                setStudents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.registerNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.domain?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#ECECEC] min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Students</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">View and manage student academic profiles.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9A4A17] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-14 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold w-full sm:w-80 shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                <div className="glass-strong rounded-[48px] border-white shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#9A4A17]/5 opacity-50 pointer-events-none"></div>
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/5">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Student Name</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Domain</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Register Number</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Academic Details</th>
                                    <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[4px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-10 py-12"><div className="h-12 bg-slate-200/50 rounded-3xl w-full"></div></td>
                                        </tr>
                                    ))
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-20 text-center">
                                            <Users size={64} className="mx-auto text-slate-200 mb-6" />
                                            <p className="text-slate-400 font-bold uppercase tracking-[4px]">No students found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-white transition-all duration-300 group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className="relative">
                                                        <img
                                                            src={student.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                            className="w-16 h-16 rounded-[24px] object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                            alt="Avatar"
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 tracking-tight uppercase leading-none mb-1">{student.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{student.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className="px-5 py-2 bg-amber-50 text-[#9A4A17] text-[10px] font-black rounded-full border border-amber-100/50 uppercase tracking-widest shadow-sm">
                                                    {student.domain}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8 text-sm font-black text-slate-900 tracking-tighter uppercase">{student.registerNumber}</td>
                                            <td className="px-8 py-8">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight leading-none">{student.department}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Year {student.year} <span className="text-slate-200 font-normal">|</span> Sem {student.semester || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => navigate(`/students/${student.user?._id}`)}
                                                        className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#9A4A17] hover:text-white hover:shadow-xl hover:shadow-amber-900/20 transition-all group/btn"
                                                        title="View Profile"
                                                    >
                                                        <Info size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <a
                                                        href={`mailto:${student.user?.email}`}
                                                        className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-xl transition-all group/btn"
                                                        title="Send Email"
                                                    >
                                                        <Mail size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="flex justify-center pt-8">
                    <div className="glass px-10 py-6 rounded-full border-white shadow-lg flex items-center space-x-12">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{students.length}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departments</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{new Set(students.map(s => s.department)).size}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default StudentList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Mail, ExternalLink, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/secretary/students');
                setStudents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const openProfile = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const sendEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Student Directory</h1>
                    <p className="text-slate-400">View and manage all club members</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-accent outline-none text-sm w-64"
                        />
                    </div>
                </div>
            </header>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">STUDENT</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">DOMAIN</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">REGISTER NO</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">DEPARTMENT</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((student) => (
                                <tr key={student._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                                                {student.user?.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{student.user?.name}</p>
                                                <p className="text-xs text-slate-500">{student.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg border border-accent/20">
                                            {student.domain}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{student.registerNumber}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{student.department} ({student.year} Year)</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openProfile(student)}
                                                className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                title="View Profile"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                            <button
                                                onClick={() => sendEmail(student.user?.email)}
                                                className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                title="Send Mail"
                                            >
                                                <Mail size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Profile Modal */}
            {showModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass max-w-2xl w-full rounded-3xl overflow-hidden border border-white/10"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-2xl font-bold">
                                        {selectedStudent.user?.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedStudent.user?.name}</h2>
                                        <p className="text-slate-400">{selectedStudent.user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Domain</p>
                                    <p className="font-semibold text-accent">{selectedStudent.domain}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Register No</p>
                                    <p className="font-mono">{selectedStudent.registerNumber}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Department</p>
                                    <p>{selectedStudent.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Year</p>
                                    <p>{selectedStudent.year} Year</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStudent.skills?.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/5">
                                            {skill}
                                        </span>
                                    )) || <p className="text-slate-500 italic">No skills added</p>}
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4 border-t border-white/5">
                                {selectedStudent.githubLink && (
                                    <a href={selectedStudent.githubLink} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-all">
                                        <ExternalLink size={14} /> <span>GitHub Profile</span>
                                    </a>
                                )}
                                {selectedStudent.linkedinLink && (
                                    <a href={selectedStudent.linkedinLink} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-all">
                                        <ExternalLink size={14} /> <span>LinkedIn Profile</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StudentList;

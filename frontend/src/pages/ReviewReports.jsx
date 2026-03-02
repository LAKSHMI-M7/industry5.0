import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, CheckCircle2, AlertCircle, Clock, ExternalLink, Send, Search, History, Target, Cpu, FileText, XCircle, CheckSquare, Paperclip, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ReviewReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [status, setStatus] = useState('Pending');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await axios.get('/api/secretary/reports');
            setReports(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (e, customStatus = null) => {
        if (e) e.preventDefault();
        const finalStatus = customStatus || status;
        try {
            await axios.put(`/api/secretary/reports/${selectedReport._id}/review`, { status: finalStatus, feedback });
            setReports(reports.map(r => r._id === selectedReport._id ? { ...r, status: finalStatus, secretaryFeedback: feedback } : r));
            setSelectedReport({ ...selectedReport, status: finalStatus, secretaryFeedback: feedback });
            alert('Report processed successfully.');
        } catch (err) {
            alert('Error updating report status.');
        }
    };

    const filteredReports = reports.filter(r =>
        r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Weekly Reports</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Review and approve student weekly reports.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9A4A17] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-14 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold w-full sm:w-80 shadow-sm"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* List of Reports */}
                    <div className="space-y-6 pr-2 max-h-[850px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-40 bg-slate-200/50 rounded-[40px] animate-pulse"></div>
                            ))
                        ) : filteredReports.length === 0 ? (
                            <div className="py-20 text-center glass rounded-[48px] border-dashed border-2">
                                <ClipboardList size={64} className="mx-auto text-slate-200 mb-6" />
                                <p className="text-slate-400 font-bold uppercase tracking-[4px]">No reports found.</p>
                            </div>
                        ) : (
                            filteredReports.map((report) => (
                                <motion.div
                                    key={report._id}
                                    onClick={() => {
                                        setSelectedReport(report);
                                        setStatus(report.status || 'Pending');
                                        setFeedback(report.secretaryFeedback || '');
                                    }}
                                    className={`glass-strong p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${selectedReport?._id === report._id
                                        ? 'border-[#9A4A17] shadow-2xl shadow-amber-900/10 bg-white ring-[1px] ring-[#9A4A17]'
                                        : 'border-white hover:bg-white hover:shadow-xl'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img
                                                    src={report.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase mb-1">{report.user?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {new Date(report.weekStartDate).toLocaleDateString()} — {new Date(report.weekEndDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${report.status === 'Verified' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                            report.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                report.status === 'Correction Requested' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    report.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        'bg-slate-50 text-slate-600 border border-slate-100'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-2">"{report.summary || report.completedWork}"</p>
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1 text-slate-400">
                                                <Cpu size={14} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{report.technologiesUsed?.length || 0} Technologies</span>
                                            </div>
                                            {report.attachments?.length > 0 && (
                                                <div className="flex items-center space-x-1 text-slate-400">
                                                    <Paperclip size={14} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">{report.attachments.length} Attachments</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Selected Report Detail View */}
                    <div className="sticky top-28 h-fit">
                        <AnimatePresence mode="wait">
                            {selectedReport ? (
                                <motion.div
                                    key={selectedReport._id}
                                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                    className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#9A4A17]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                    <div className="mb-10 flex border-b border-slate-100 pb-8 justify-between items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={selectedReport.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReport.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                className="w-20 h-20 rounded-[32px] object-cover border-4 border-white shadow-xl mr-6"
                                                alt="Avatar"
                                            />
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{selectedReport.user?.name}</h3>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px]">Weekly Report Details</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-widest flex items-center"><Target size={14} className="mr-2" /> Summary</p>
                                                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 min-h-[150px]">
                                                    <p className="text-slate-600 font-bold leading-relaxed text-sm">{selectedReport.summary || selectedReport.completedWork}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center"><Clock size={14} className="mr-2" /> Next Week's Plan</p>
                                                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 min-h-[150px]">
                                                    <p className="text-slate-500 font-bold leading-relaxed text-sm italic">"{selectedReport.nextWeekPlan}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedReport.issuesFaced && (
                                            <div className="p-8 bg-red-50/50 border border-red-100/50 rounded-[40px] flex items-start space-x-6 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-2 h-full bg-red-400 opacity-20"></div>
                                                <AlertTriangle className="text-red-500 shrink-0 mt-1" size={24} />
                                                <div>
                                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 leading-none">Issues Faced</p>
                                                    <p className="font-bold text-slate-700 leading-relaxed text-sm">{selectedReport.issuesFaced}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technologies Used</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedReport.technologiesUsed?.map((tech, i) => (
                                                        <span key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#9A4A17] group-hover:border-[#9A4A17]/20 transition-all">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attachments</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedReport.attachments?.map((file, i) => (
                                                        <a key={i} href={file} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-[#9A4A17] transition-all shadow-lg shadow-slate-900/20">
                                                            <Paperclip size={18} />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8 pt-10 border-t border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-2">Verification & Feedback</p>

                                            <div className="space-y-6">
                                                <textarea
                                                    required
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    rows="4"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-[32px] py-6 px-8 focus:bg-white focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold text-sm shadow-inner"
                                                    placeholder="Provide administrative remarks or requested corrections..."
                                                ></textarea>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <button
                                                        onClick={(e) => {
                                                            const newStatus = user?.role === 'chairperson' ? 'Verified' : 'Approved';
                                                            handleReview(e, newStatus);
                                                        }}
                                                        className="flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                    >
                                                        <CheckSquare size={18} />
                                                        <span>{user?.role === 'chairperson' ? 'Approve (Verify)' : 'Approve Report'}</span>
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleReview(e, 'Correction Requested')}
                                                        className="flex items-center justify-center space-x-3 bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                    >
                                                        <History size={18} />
                                                        <span>Request Correction</span>
                                                    </button>

                                                    <button
                                                        onClick={(e) => handleReview(e, 'Rejected')}
                                                        className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                    >
                                                        <XCircle size={18} />
                                                        <span>Reject Report</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {selectedReport.secretaryFeedback && (
                                                <p className="text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">Report processed successfully.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-strong p-20 rounded-[56px] border-white shadow-2xl border-dashed border-4 flex flex-col items-center justify-center text-slate-400 space-y-6 text-center animate-pulse h-full">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                                        <ClipboardList size={48} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Select a Report</p>
                                        <p className="font-bold text-sm tracking-widest uppercase">Select a report from the list to view details and provide feedback.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewReports;

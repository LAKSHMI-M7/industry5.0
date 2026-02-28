import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Calendar, Github, Send, CheckCircle2, AlertTriangle, PlayCircle, History, Plus, Trash2, Code, Paperclip, CheckSquare, ShieldCheck, Activity, Cpu, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [formData, setFormData] = useState({
        weekStartDate: '',
        weekEndDate: '',
        summary: '',
        technologiesUsed: '',
        issuesFaced: '',
        nextWeekPlan: '',
        attachments: ['']
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await axios.get('/api/student/weekly-report');
            setReports(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddField = () => {
        setFormData({ ...formData, attachments: [...formData.attachments, ''] });
    };

    const handleRemoveField = (index) => {
        const newArr = formData.attachments.filter((_, i) => i !== index);
        setFormData({ ...formData, attachments: newArr });
    };

    const handleFieldChange = (index, value) => {
        const newArr = [...formData.attachments];
        newArr[index] = value;
        setFormData({ ...formData, attachments: newArr });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                attachments: formData.attachments.filter(a => a.trim() !== '')
            };
            const { data } = await axios.post('/api/student/weekly-report', submissionData);
            setReports([data, ...reports]);
            setFormData({
                weekStartDate: '',
                weekEndDate: '',
                summary: '',
                technologiesUsed: '',
                issuesFaced: '',
                nextWeekPlan: '',
                attachments: ['']
            });
            setMessage({ type: 'success', text: 'Weekly report submitted successfully.' });
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to submit report.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Weekly Report Submission</h1>
                        <p className="text-slate-500 font-bold ml-1 tracking-widest text-sm opacity-60">Submit your weekly report and review your progress.</p>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-[3px] border shadow-2xl flex items-center space-x-4 ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                            >
                                {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                                <span>{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Report Submission */}
                    <div className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl h-fit sticky top-28">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-2xl font-black flex items-center space-x-5 tracking-tight text-slate-900">
                                <div className="w-14 h-14 bg-[#92400E] rounded-[22px] flex items-center justify-center shadow-xl shadow-amber-900/30">
                                    <ClipboardList className="text-white" size={28} />
                                </div>
                                <span>New Weekly Report</span>
                            </h3>
                            <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center shadow-inner">
                                <Plus size={20} className="text-[#92400E] opacity-50" />
                            </div>
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Week Start Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={formData.weekStartDate}
                                            onChange={(e) => setFormData({ ...formData, weekStartDate: e.target.value })}
                                            className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight uppercase text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Week End Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={formData.weekEndDate}
                                            onChange={(e) => setFormData({ ...formData, weekEndDate: e.target.value })}
                                            className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight uppercase text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Weekly Summary</label>
                                <textarea
                                    required
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    rows="5"
                                    className="w-full bg-white/60 border border-slate-200/60 rounded-[40px] py-8 px-10 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-lg leading-relaxed placeholder:text-slate-300"
                                    placeholder="Summarize your work for this week..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Technologies Used</label>
                                    <div className="relative group">
                                        <Code className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                        <input
                                            value={formData.technologiesUsed}
                                            onChange={(e) => setFormData({ ...formData, technologiesUsed: e.target.value })}
                                            className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-5 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight"
                                            placeholder="e.g. React, Python..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Plan for Next Week</label>
                                    <div className="relative group">
                                        <TrendingUp className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                        <input
                                            required
                                            value={formData.nextWeekPlan}
                                            onChange={(e) => setFormData({ ...formData, nextWeekPlan: e.target.value })}
                                            className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-5 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight"
                                            placeholder="What do you plan to achieve next week?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Attachments / Links</label>
                                    <button type="button" onClick={handleAddField} className="text-[#92400E] text-[9px] font-black uppercase tracking-widest hover:scale-110 transition-transform bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">+ Add Link</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.attachments.map((at, idx) => (
                                        <div key={idx} className="relative group">
                                            <Paperclip className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                value={at}
                                                onChange={(e) => handleFieldChange(idx, e.target.value)}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-16 pr-14 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-sm"
                                                placeholder="Link URL"
                                            />
                                            {formData.attachments.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveField(idx)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#92400E] hover:bg-[#78350F] text-white font-black py-7 rounded-[40px] shadow-2xl shadow-amber-900/30 hover:shadow-amber-900/50 hover:-translate-y-2 active:translate-y-0 transition-all flex items-center justify-center space-x-5 disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={28} className="group-hover:translate-x-3 group-hover:-translate-y-1 transition-transform duration-500" />
                                        <span className="text-2xl tracking-tighter uppercase">Submit Weekly Report</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-5">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50"><History className="text-[#92400E]" size={28} /></div>
                                <span>Report History</span>
                            </h3>
                            <div className="px-4 py-2 bg-white/60 rounded-full border border-white text-[10px] font-bold text-slate-400 tracking-widest shadow-sm">
                                Total Submissions: {reports.length}
                            </div>
                        </div>


                        <div className="space-y-10 max-h-[1400px] overflow-y-auto custom-scrollbar p-2">
                            {reports.length === 0 ? (
                                <div className="py-32 text-center glass rounded-[64px] border-dashed border-2 border-slate-200">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                        <ClipboardList size={56} />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase tracking-[6px] text-xs">No reports submitted yet.</p>
                                </div>
                            ) : (
                                reports.map((report, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={report._id}
                                        className="glass-strong p-10 md:p-12 rounded-[64px] border-white shadow-xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#92400E]/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-1000"></div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-10 relative z-10">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-[#92400E] shadow-xl border border-amber-50 group-hover:rotate-6 transition-transform">
                                                    <Activity size={32} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] mb-2 leading-none">Report Period</p>
                                                    <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                                        {new Date(report.weekStartDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} — {new Date(report.weekEndDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[4px] shadow-xl self-start md:self-center flex items-center space-x-3 ${report.status === 'Approved' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                                report.status === 'Rejected' ? 'bg-red-500 text-white shadow-red-500/20' :
                                                    'bg-slate-900 text-white shadow-slate-900/20'
                                                }`}>
                                                {report.status === 'Approved' ? <ShieldCheck size={16} /> : report.status === 'Rejected' ? <AlertTriangle size={16} /> : <Cpu size={16} className="animate-spin duration-3000" />}
                                                <span>{report.status}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-10 relative z-10">
                                            <div>
                                                <h4 className="text-[10px] font-black text-[#92400E] uppercase tracking-[4px] flex items-center mb-6">
                                                    <CheckSquare size={16} className="mr-3" />
                                                    <span>Summary</span>
                                                </h4>
                                                <div className="p-8 bg-white/60 rounded-[40px] border border-white shadow-inner">
                                                    <p className="text-slate-600 font-bold leading-relaxed text-lg italic">"{report.summary}"</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 group/item">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <TrendingUp size={16} className="text-[#92400E]" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none">Next Week's Plan</p>
                                                    </div>
                                                    <p className="text-slate-900 font-black tracking-tight text-sm uppercase group-hover:translate-x-1 transition-transform">{report.nextWeekPlan}</p>
                                                </div>
                                                <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 group/item">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <Code size={16} className="text-[#92400E]" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] leading-none">Technology Stack</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 group-hover:translate-x-1 transition-transform">
                                                        {(typeof report.technologiesUsed === 'string' ? report.technologiesUsed.split(',') : (report.technologiesUsed || [])).map((tech, idx) => (
                                                            <span key={idx} className="bg-white px-4 py-2 rounded-xl text-[9px] font-black border border-slate-200 text-[#92400E] uppercase shadow-sm"># {tech.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {report.issuesFaced && (
                                                <div className="p-8 bg-red-50 border border-red-100 rounded-[40px] flex items-start space-x-5 shadow-sm">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm"><AlertTriangle size={24} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[4px] mb-2 leading-none">Issues Faced</p>
                                                        <p className="text-sm font-bold text-slate-500 leading-relaxed italic">"{report.issuesFaced}"</p>
                                                    </div>
                                                </div>
                                            )}

                                            {report.secretaryFeedback && (
                                                <div className="p-10 bg-slate-900 rounded-[48px] text-white shadow-2xl relative overflow-hidden group/feedback mt-6 transform hover:-translate-y-1 transition-transform duration-500">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover/feedback:scale-125 transition-transform duration-1000"></div>
                                                    <p className="text-[10px] font-bold text-[#92400E] uppercase tracking-[5px] mb-6 flex items-center space-x-4">
                                                        <CheckCircle2 size={18} />
                                                        <span>Reviewer Feedback</span>
                                                    </p>
                                                    <p className="text-xl font-black tracking-tight text-white/95 leading-relaxed italic">"{report.secretaryFeedback}"</p>

                                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 text-white/30">
                                                            <UserCircle size={14} />
                                                            <span className="text-[8px] font-bold tracking-[3px]">Reviewed Status</span>
                                                        </div>
                                                        <CheckCircle2 size={20} className="text-emerald-400" />
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

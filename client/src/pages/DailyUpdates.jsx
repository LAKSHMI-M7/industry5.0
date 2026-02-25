import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, AlertCircle, Send, CheckCircle2, Image as ImageIcon, Link as LinkIcon, History, Plus, Trash2, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DailyUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [formData, setFormData] = useState({
        workDone: '',
        timeSpent: '',
        images: [''],
        links: ['']
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const { data } = await axios.get('/api/student/daily-update');
            setUpdates(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleRemoveField = (field, index) => {
        const newArr = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArr });
    };

    const handleFieldChange = (field, index, value) => {
        const newArr = [...formData[field]];
        newArr[index] = value;
        setFormData({ ...formData, [field]: newArr });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                images: formData.images.filter(img => img.trim() !== ''),
                links: formData.links.filter(link => link.trim() !== '')
            };
            const { data } = await axios.post('/api/student/daily-update', submissionData);
            setUpdates([data, ...updates]);
            setFormData({ workDone: '', timeSpent: '', images: [''], links: [''] });
            setMessage({ type: 'success', text: 'Update submitted successfully.' });
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to submit update.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Daily Updates</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Track your daily progress and activities.</p>
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
                    {/* Submission Form */}
                    <div className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl h-fit sticky top-28">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-2xl font-black flex items-center space-x-5 uppercase tracking-tight text-slate-900">
                                <div className="w-14 h-14 bg-[#92400E] rounded-[22px] flex items-center justify-center shadow-xl shadow-amber-900/30 group-hover:rotate-6 transition-transform">
                                    <Plus className="text-white" size={28} />
                                </div>
                                <span>Add New Update</span>
                            </h3>
                            <div className="w-12 h-12 bg-white/60 rounded-2xl flex items-center justify-center shadow-inner">
                                <Cpu size={20} className="text-[#92400E] animate-pulse" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Work Description</label>
                                <textarea
                                    required
                                    value={formData.workDone}
                                    onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
                                    rows="5"
                                    className="w-full bg-white/60 border border-slate-200/60 rounded-[40px] py-8 px-10 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-lg leading-relaxed placeholder:text-slate-300"
                                    placeholder="Describe the tasks you completed today..."
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Time Spent</label>
                                <div className="relative group">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E] transition-colors" size={22} />
                                    <input
                                        required
                                        value={formData.timeSpent}
                                        onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                                        className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-5 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight uppercase"
                                        placeholder="e.g. 05H 30M"
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Images</label>
                                    <button type="button" onClick={() => handleAddField('images')} className="text-[#92400E] text-[9px] font-black uppercase tracking-widest hover:scale-110 transition-transform bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">+ Add Image</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                value={img}
                                                onChange={(e) => handleFieldChange('images', idx, e.target.value)}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-16 pr-14 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-sm"
                                                placeholder="Image URL"
                                            />
                                            {formData.images.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveField('images', idx)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Links</label>
                                    <button type="button" onClick={() => handleAddField('links')} className="text-[#92400E] text-[9px] font-black uppercase tracking-widest hover:scale-110 transition-transform bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">+ Add Link</button>
                                </div>
                                <div className="space-y-4">
                                    {formData.links.map((link, idx) => (
                                        <div key={idx} className="relative group">
                                            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                value={link}
                                                onChange={(e) => handleFieldChange('links', idx, e.target.value)}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-16 pr-14 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-sm"
                                                placeholder="Project Link (GitHub/Drive)"
                                            />
                                            {formData.links.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveField('links', idx)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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
                                        <span className="text-2xl tracking-tighter uppercase">Submit Update</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* History List */}
                    <div className="space-y-10">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center space-x-5">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50"><History className="text-[#92400E]" size={28} /></div>
                                <span>Update History</span>
                            </h3>
                            <div className="px-4 py-2 bg-white/60 rounded-full border border-white text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                                Total Records: {updates.length}
                            </div>
                        </div>

                        <div className="space-y-8 max-h-[1200px] overflow-y-auto custom-scrollbar p-2">
                            {updates.length === 0 ? (
                                <div className="py-32 text-center glass rounded-[64px] border-dashed border-2 border-slate-200">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                        <FileText size={56} />
                                    </div>
                                    <p className="text-slate-400 font-black uppercase tracking-[6px] text-xs">No updates submitted yet.</p>
                                </div>
                            ) : (
                                updates.map((update, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={update._id}
                                        className="glass-strong p-10 rounded-[56px] border-white shadow-xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#92400E]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                                        <div className="flex justify-between items-start mb-12 relative z-10">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-16 h-16 bg-white rounded-[24px] flex flex-col items-center justify-center text-[#92400E] shadow-xl border border-amber-50 group-hover:rotate-3 transition-transform">
                                                    <span className="text-2xl font-black leading-none">{new Date(update.date).getDate()}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">{new Date(update.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] mb-1">Temporal Stamp</p>
                                                    <p className="text-xl font-black text-slate-900 tracking-tight uppercase">{new Date(update.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px] mb-1">Session Duration</p>
                                                <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 shadow-inner">
                                                    <p className="text-lg font-black text-slate-900 tracking-tight uppercase">{update.timeSpent}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8 relative z-10">
                                            <div className="bg-white/60 p-8 rounded-[40px] border border-white shadow-inner">
                                                <p className="text-[10px] font-black text-[#92400E] uppercase tracking-[4px] mb-4 flex items-center"><Activity size={14} className="mr-3" /> Work Done</p>
                                                <p className="text-slate-600 font-bold text-lg leading-relaxed italic">"{update.workDone}"</p>
                                            </div>

                                            {(update.images?.length > 0 || update.links?.length > 0) && (
                                                <div className="flex flex-wrap gap-4">
                                                    {update.images?.map((img, idx) => (
                                                        <div key={idx} className="w-20 h-20 rounded-[22px] overflow-hidden border-4 border-white shadow-xl hover:scale-110 hover:-rotate-3 transition-all duration-500 cursor-pointer shadow-amber-900/5">
                                                            <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {update.links?.map((link, idx) => (
                                                        <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[18px] bg-slate-900 shadow-xl flex items-center justify-center text-white hover:bg-[#92400E] hover:rotate-6 transition-all duration-500 group/link">
                                                            <LinkIcon size={20} className="group-hover/link:animate-pulse" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {(update.secretaryReply || update.secretaryFeedback) && (
                                            <div className="mt-12 p-10 bg-[#92400E] rounded-[48px] relative overflow-hidden group/feedback">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/feedback:scale-110 transition-transform"></div>
                                                <p className="text-[10px] font-black text-white/60 uppercase tracking-[5px] mb-6 flex items-center space-x-3">
                                                    <ShieldCheck size={16} />
                                                    <span>Secretary Feedback</span>
                                                </p>
                                                <p className="text-white text-xl font-black tracking-tight leading-relaxed italic">"{update.secretaryReply || update.secretaryFeedback}"</p>
                                                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 text-white/40">
                                                        <Cpu size={14} />
                                                        <span className="text-[8px] font-black uppercase tracking-[3px]">Feedback Received</span>
                                                    </div>
                                                    <CheckCircle2 size={18} className="text-emerald-400" />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyUpdates;

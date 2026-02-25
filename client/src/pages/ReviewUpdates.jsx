import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, CheckCircle2, User, Clock, Image as ImageIcon, Link as LinkIcon, AlertCircle, Search, History, ChevronRight, ShieldCheck, Activity, Cpu, XCircle, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ReviewUpdates = () => {
    const { user } = useAuth();
    const [updates, setUpdates] = useState([]);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const { data } = await axios.get('/api/secretary/updates');
            setUpdates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        try {
            await axios.put(`/api/secretary/updates/${selectedUpdate._id}/reply`, { reply, status });
            setUpdates(updates.map(u => u._id === selectedUpdate._id ? { ...u, secretaryReply: reply, status } : u));
            setSelectedUpdate({ ...selectedUpdate, secretaryReply: reply, status });
            setReply(reply);
            alert(`Update marked as ${status}`);
        } catch (err) {
            alert('Error updating status.');
        }
    };

    const filteredUpdates = updates.filter(u =>
        u.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.workDone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && updates.length === 0) {
        return (
            <div className="bg-[#ECECEC] min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#9A4A17]/20 border-t-[#9A4A17] rounded-full animate-spin"></div>
                    <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#9A4A17] animate-pulse" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[6px] animate-pulse">Loading Daily Updates...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#ECECEC] min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Daily Updates</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Review and provide feedback on student daily academic updates.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#9A4A17] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search updates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/60 border border-slate-200/60 rounded-[32px] py-5 pl-16 pr-8 focus:bg-white focus:ring-[15px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold w-full sm:w-96 shadow-sm"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* List of Updates */}
                    <div className="space-y-6 pr-2 max-h-[900px] overflow-y-auto custom-scrollbar p-2">
                        {filteredUpdates.length === 0 ? (
                            <div className="py-24 text-center glass rounded-[56px] border-dashed border-2 border-slate-200">
                                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                    <History size={56} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[6px] text-xs">No updates found.</p>
                            </div>
                        ) : (
                            filteredUpdates.map((update, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={update._id}
                                    onClick={() => {
                                        setSelectedUpdate(update);
                                        setReply(update.secretaryReply || '');
                                    }}
                                    className={`glass-strong p-8 rounded-[48px] border transition-all cursor-pointer group relative overflow-hidden ${selectedUpdate?._id === update._id
                                        ? 'border-[#9A4A17] shadow-2xl shadow-amber-900/10 bg-white scale-[1.02]'
                                        : 'border-white hover:bg-white/80 hover:shadow-xl hover:-translate-y-1'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center space-x-5">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-[22px] p-1 bg-white shadow-md">
                                                    <img
                                                        src={update.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(update.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                        className="w-full h-full rounded-[18px] object-cover"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${update.status === 'Approved' ? 'bg-emerald-500' :
                                                        update.status === 'Rejected' ? 'bg-red-500' :
                                                            update.status === 'Correction Requested' ? 'bg-amber-500' :
                                                                'bg-blue-500 animate-pulse'
                                                    }`}></div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase mb-2">{update.user?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px] leading-none">{new Date(update.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${update.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                update.status === 'Correction Requested' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                    update.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                            {update.status || 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-2 italic mb-6">"{update.workDone}"</p>
                                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <div className="p-2 bg-slate-50 rounded-xl"><Clock size={16} /></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">{update.timeSpent} Logged</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Selected Detail View */}
                    <div className="sticky top-28 h-fit">
                        <AnimatePresence mode="wait">
                            {selectedUpdate ? (
                                <motion.div
                                    key={selectedUpdate._id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#9A4A17]/5 rounded-full blur-3xl -mr-24 -mt-24"></div>

                                    <div className="mb-10 flex items-center border-b border-slate-100 pb-8">
                                        <div className="w-20 h-20 rounded-[28px] p-1 bg-white shadow-xl mr-6 transform -rotate-2">
                                            <img
                                                src={selectedUpdate.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUpdate.user?.name || 'S')}&background=9A4A17&color=fff&bold=true`}
                                                className="w-full h-full rounded-[24px] object-cover"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{selectedUpdate.user?.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px] flex items-center">
                                                <Clock size={14} className="mr-2 text-blue-500" />
                                                {new Date(selectedUpdate.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-[4px] flex items-center"><Activity size={16} className="mr-3" /> Work Log Details</p>
                                            <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 shadow-inner">
                                                <p className="text-slate-600 font-bold text-base leading-relaxed italic">"{selectedUpdate.workDone}"</p>
                                            </div>
                                        </div>

                                        {(selectedUpdate.images?.length > 0 || selectedUpdate.links?.length > 0) && (
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Attachments</p>
                                                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                                    {selectedUpdate.images?.map((img, i) => (
                                                        <a key={i} href={img} target="_blank" rel="noreferrer" className="aspect-square rounded-[20px] overflow-hidden border-4 border-white shadow-xl hover:scale-110 transition-all duration-500">
                                                            <img src={img} className="w-full h-full object-cover" alt="Artifact" />
                                                        </a>
                                                    ))}
                                                    {selectedUpdate.links?.map((link, i) => (
                                                        <a key={i} href={link} target="_blank" rel="noreferrer" className="aspect-square rounded-[20px] bg-slate-900 flex items-center justify-center text-white hover:bg-[#9A4A17] shadow-xl hover:scale-110 transition-all duration-500 group/link">
                                                            <LinkIcon size={20} className="group-hover/link:animate-pulse" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-8 pt-8 border-t border-slate-100">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-4">Administrative Feedback</label>
                                                <textarea
                                                    required
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    rows="4"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-[32px] py-6 px-8 focus:bg-white focus:ring-[12px] focus:ring-[#9A4A17]/5 focus:border-[#9A4A17] outline-none transition-all text-slate-900 font-bold text-sm shadow-inner"
                                                    placeholder="Provide academic feedback or remarks here..."
                                                ></textarea>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => handleAction('Approved')}
                                                    className="flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                >
                                                    <CheckSquare size={18} />
                                                    <span>Approve</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('Correction Requested')}
                                                    className="flex items-center justify-center space-x-3 bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                >
                                                    <History size={18} />
                                                    <span>Correction</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAction('Rejected')}
                                                    className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-[24px] shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-[10px]"
                                                >
                                                    <XCircle size={18} />
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="glass-strong p-24 rounded-[64px] border-white shadow-2xl border-dashed border-4 flex flex-col items-center justify-center text-slate-400 space-y-10 text-center h-full">
                                    <MessageSquare size={64} className="animate-pulse opacity-20" />
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Select an Update</p>
                                        <p className="font-bold text-[10px] tracking-[4px] uppercase text-slate-400 max-w-xs mx-auto leading-relaxed">Select a student update from the list to view academic details and provide feedback.</p>
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

export default ReviewUpdates;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Award, MapPin, Clock, Plus, History, CheckCircle2, Trophy, Upload, Trash2, Globe, ShieldCheck, Zap, Sparkles, Binary } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        type: 'Hackathon',
        organizer: '',
        date: '',
        description: '',
        certificateUrl: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/api/student/events');
            setEvents(data);
        } catch (err) {
            console.error('Error fetching events', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/student/events', formData);
            setMessage({ type: 'success', text: 'Achievement synchronized with identity protocol.' });
            setFormData({
                eventName: '',
                type: 'Hackathon',
                organizer: '',
                date: '',
                description: '',
                certificateUrl: ''
            });
            setShowForm(false);
            fetchEvents();
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to record scholastic event.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Achievement Matrix</h1>
                        <p className="text-slate-500 font-bold ml-1 text-sm">Scholastic Engagements <span className="text-amber-700">|</span> Institutional Verification</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#92400E] hover:bg-[#78350F] text-white font-black py-5 px-10 rounded-[30px] shadow-2xl shadow-amber-900/30 hover:-translate-y-1.5 active:translate-y-0 transition-all flex items-center space-x-4 group text-xs"
                    >
                        <Plus size={22} className={`${showForm ? 'rotate-45' : ''} transition-transform duration-500`} />
                        <span>{showForm ? 'Cancel Entry' : 'Record Achievement'}</span>
                    </button>
                </header>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`px-8 py-5 rounded-[28px] font-black text-xs border shadow-2xl max-w-2xl mx-auto text-center flex items-center justify-center space-x-4 ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                        >
                            {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                            <span>{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                            className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl mb-16 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#92400E]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <h3 className="text-2xl font-black mb-12 flex items-center space-x-5 tracking-tight text-slate-900">
                                <div className="w-14 h-14 bg-[#92400E] rounded-[22px] flex items-center justify-center shadow-xl shadow-amber-900/30">
                                    <Sparkles className="text-white" size={28} />
                                </div>
                                <span>Institutional Entry Protocol</span>
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 ml-4">Event nomenclature</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={20} />
                                            <input
                                                name="eventName"
                                                required
                                                value={formData.eventName}
                                                onChange={handleChange}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight"
                                                placeholder="SIH 2024..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 ml-4">Event classification</label>
                                        <div className="relative group">
                                            <Binary className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight appearance-none cursor-pointer"
                                            >
                                                <option value="Hackathon">Level: Hackathon</option>
                                                <option value="Workshop">Level: Workshop</option>
                                                <option value="Technical">Level: Symposium</option>
                                                <option value="Non-Technical">Level: Open Hub</option>
                                                <option value="PPT">Level: Publication</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 ml-4">Organizing body</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={20} />
                                            <input
                                                name="organizer"
                                                required
                                                value={formData.organizer}
                                                onChange={handleChange}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight"
                                                placeholder="Academic Entity..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 ml-4">Engagement date</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={20} />
                                            <input
                                                name="date"
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black tracking-tight"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 ml-4">Achievement manifest</label>
                                        <div className="relative group">
                                            <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E]" size={20} />
                                            <input
                                                name="description"
                                                required
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="w-full bg-white/60 border border-slate-200/60 rounded-[30px] py-4 pl-16 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold tracking-tight"
                                                placeholder="Description of scholastic impact..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 border border-white/60 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white rounded-[24px] shadow-xl flex items-center justify-center text-[#92400E] border border-amber-50">
                                            <Award size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm">Digital Credential</h4>
                                            <p className="text-[10px] text-slate-500 font-black mt-1">Institutional verification required</p>
                                        </div>
                                    </div>
                                    <button type="button" className="bg-white border border-slate-100 text-slate-900 font-black py-5 px-10 rounded-[24px] hover:bg-slate-50 transition-all flex items-center space-x-4 shadow-xl hover:-translate-y-1 text-[10px]">
                                        <Upload size={20} className="text-[#92400E]" />
                                        <span>Link Artifact (PDF/IMG)</span>
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#92400E] hover:bg-[#78350F] text-white font-black py-7 rounded-[40px] shadow-2xl shadow-amber-900/40 hover:-translate-y-2 active:translate-y-0 transition-all flex items-center justify-center space-x-5 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <ShieldCheck size={28} className="group-hover:scale-110 transition-transform duration-500" />
                                            <span className="text-2xl tracking-tighter">Authorize entry to portfolio</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-10">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-5">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"><History className="text-[#92400E]" size={28} /></div>
                            <span>Validated Portfolio</span>
                        </h3>
                        <div className="px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-white text-[10px] font-black text-slate-400 shadow-sm">
                            Total Engagements: {events.length}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {events.length === 0 ? (
                            <div className="col-span-full py-32 text-center glass rounded-[64px] border-dashed border-2 border-slate-200">
                                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner">
                                    <Trophy size={64} />
                                </div>
                                <p className="text-slate-400 font-black text-xs">Primary matrix synchronized: No entries</p>
                            </div>
                        ) : (
                            events.map((event, index) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                                    key={event._id}
                                    className="glass-strong p-10 rounded-[56px] hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden flex flex-col h-full"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#92400E]/5 rounded-bl-[56px] flex items-center justify-center group-hover:bg-[#92400E]/10 transition-colors duration-500">
                                        <Trophy size={32} className="text-[#92400E] opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className={`px-5 py-2 rounded-2xl text-[9px] font-black shadow-sm transform group-hover:scale-105 transition-transform ${event.type === 'Hackathon' ? 'bg-amber-100/80 text-amber-700 border border-amber-200/50' :
                                                event.type === 'Workshop' ? 'bg-slate-100/80 text-slate-700 border border-slate-200/50' :
                                                    'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50'
                                                }`}>
                                                {event.type}
                                            </div>
                                            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                                            <span className="text-[10px] font-black text-slate-400">{new Date(event.date).getFullYear()}</span>
                                        </div>

                                        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight group-hover:text-[#92400E] transition-colors">{event.eventName}</h4>

                                        <div className="flex items-center space-x-3 mb-8 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50 w-fit">
                                            <ShieldCheck size={16} className="text-[#92400E]" />
                                            <span className="text-[11px] font-black text-slate-500">{event.organizer}</span>
                                        </div>

                                        <p className="text-slate-600 text-sm font-bold leading-relaxed mb-10 italic border-l-2 border-slate-100 pl-6 group-hover:border-[#92400E]/30 transition-colors">
                                            "{event.description}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100"><Calendar size={14} /></div>
                                            <span className="text-[10px] font-black">{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                        <button className="text-[#92400E] font-black text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100/50">
                                            <Award size={16} />
                                            <span>Verify Artifact</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;

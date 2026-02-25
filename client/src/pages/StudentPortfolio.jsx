import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User, Mail, Phone, Github, Linkedin, Calendar,
    BookOpen, Award, BarChart2, CheckCircle2,
    ChevronLeft, ExternalLink, Shield, GraduationCap,
    Clock, Image as ImageIcon, Link as LinkIcon, FileText,
    Target, Cpu, AlertCircle, History, Trophy, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentPortfolio = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const { data } = await axios.get(`/api/secretary/students/${userId}`);
                setData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [userId]);

    if (loading) return (
        <div className="bg-[#ECECEC] min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#9A4A17]/20 border-t-[#9A4A17] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap size={24} className="text-[#9A4A17]" />
                </div>
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[6px] animate-pulse">Retrieving Scholar Profile...</p>
        </div>
    );

    if (!data?.profile) return (
        <div className="bg-[#ECECEC] min-h-screen flex flex-col items-center justify-center p-8 font-['Outfit']">
            <div className="glass-strong p-16 rounded-[56px] text-center max-w-2xl border-white shadow-2xl">
                <Shield size={64} className="mx-auto text-slate-200 mb-8 opacity-40" />
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Profile Not Finalized</h2>
                <p className="text-slate-500 font-bold mt-4 text-lg">This student has not yet completed their institutional portfolio.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-10 px-10 py-5 bg-[#9A4A17] text-white rounded-[28px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-amber-900/40 transition-all flex items-center mx-auto space-x-3 active:scale-95"
                >
                    <ChevronLeft size={24} />
                    <span className="text-lg">Back to Students</span>
                </button>
            </div>
        </div>
    );

    const { profile, updates, reports, events, attendance } = data;

    const tabs = [
        { id: 'overview', name: 'Profile Overview', icon: <User size={18} /> },
        { id: 'activity', name: 'Daily Updates', icon: <History size={18} /> },
        { id: 'performance', name: 'Weekly Reports', icon: <BarChart2 size={18} /> },
        { id: 'achievements', name: 'Achievements', icon: <Trophy size={18} /> },
        { id: 'attendance', name: 'Attendance', icon: <Calendar size={18} /> }
    ];

    return (
        <div className="bg-[#ECECEC] min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Navigation Header */}
                <nav className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white border border-slate-200/50 hover:bg-white hover:border-[#9A4A17]/30 transition-all shadow-sm"
                    >
                        <ChevronLeft className="text-[#9A4A17] group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Student Directory</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border ${profile.cgpa >= 8 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {profile.cgpa >= 8 ? 'High Academic Merit' : 'Institutional Scholar'}
                        </div>
                    </div>
                </nav>

                {/* Profile Header Card */}
                <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-200 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#9A4A17]/5 to-transparent pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                        <div className="relative">
                            <img
                                src={profile.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.user?.name)}&background=9A4A17&color=fff&size=200&bold=true`}
                                alt="Scholar"
                                className="w-48 h-48 rounded-[48px] object-cover border-8 border-slate-50 shadow-2xl group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#9A4A17] rounded-3xl shadow-xl flex items-center justify-center border-4 border-white text-white">
                                <GraduationCap size={28} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-[6px] mb-2 leading-none">Jeppiaar Institute OF Technology</p>
                                <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">{profile.user?.name}</h1>
                                <p className="text-slate-500 font-bold mt-4 uppercase tracking-[2px] text-sm">{profile.domain} <span className="text-slate-300 mx-2">|</span> {profile.department}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Register Number</p>
                                    <p className="font-black text-slate-900 tracking-wider text-sm">{profile.registerNumber}</p>
                                </div>
                                <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CGPA</p>
                                    <p className="font-black text-slate-900 tracking-wider text-sm">{profile.cgpa}</p>
                                </div>
                                <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrears</p>
                                    <p className={`font-black tracking-wider text-sm ${profile.arrears > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{profile.arrears}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center md:justify-start pt-4">
                                {profile.githubLink && (
                                    <a href={profile.githubLink} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"><Github size={20} /></a>
                                )}
                                {profile.linkedinLink && (
                                    <a href={profile.linkedinLink} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0077b5] text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"><Linkedin size={20} /></a>
                                )}
                                <a href={`mailto:${profile.user?.email}`} className="w-12 h-12 bg-white text-slate-600 border border-slate-200 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"><Mail size={20} /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs Navigation */}
                <div className="flex flex-wrap gap-4 justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[2px] flex items-center space-x-3 transition-all ${activeTab === tab.id
                                ? 'bg-[#9A4A17] text-white shadow-2xl scale-105'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm border border-slate-200'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Active Content Area */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <section className="space-y-8">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                            <BookOpen className="text-[#9A4A17]" size={24} />
                                            <span>Academic Particulars</span>
                                        </h3>
                                        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Contact</p>
                                                <p className="font-bold text-slate-900">{profile.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional Email</p>
                                                <p className="font-bold text-slate-900">{profile.user?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Year</p>
                                                <p className="font-bold text-slate-900">{profile.year} Year / Section {profile.section}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Period</p>
                                                <p className="font-bold text-slate-900">Semester {profile.semester}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                            <Cpu className="text-[#9A4A17]" size={24} />
                                            <span>Technical Domain Skills</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {profile.skills?.map((skill, i) => (
                                                <span key={i} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm text-slate-600 hover:text-[#9A4A17] hover:border-[#9A4A17]/30 transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                            <BarChart2 className="text-[#9A4A17]" size={24} />
                                            <span>Activities Summary</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white p-8 rounded-[40px] text-center border border-slate-200 shadow-lg group hover:bg-[#9A4A17] transition-colors duration-500">
                                                <p className="text-[10px] font-black text-[#9A4A17] group-hover:text-white uppercase tracking-widest mb-3 transition-colors">Daily Updates</p>
                                                <span className="text-5xl font-black text-slate-900 group-hover:text-white transition-colors">{updates.length}</span>
                                                <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">Total Submitted</p>
                                            </div>
                                            <div className="bg-white p-8 rounded-[40px] text-center border border-slate-200 shadow-lg group hover:bg-[#9A4A17] transition-colors duration-500">
                                                <p className="text-[10px] font-black text-[#9A4A17] group-hover:text-white uppercase tracking-widest mb-3 transition-colors">Achievements</p>
                                                <span className="text-5xl font-black text-slate-900 group-hover:text-white transition-colors">{events.length}</span>
                                                <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">Total Honors</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Academic Attendance Stream</p>
                                            {attendance.length > 0 ? (
                                                <div className="space-y-4">
                                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-1000"
                                                            style={{ width: `${(attendance.filter(a => a.status === 'Present').length / attendance.length) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-emerald-600 font-bold">Present: {attendance.filter(a => a.status === 'Present').length}</span>
                                                        <span className="text-slate-400">Total Sessions: {attendance.length}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 font-bold italic text-sm text-center">No attendance data stream available.</p>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                        <History className="text-[#9A4A17]" size={24} />
                                        <span>Daily Update History</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {updates.length === 0 ? (
                                            <div className="col-span-2 py-20 text-center bg-white rounded-[48px] border-dashed border-2 border-slate-200">
                                                <Clock size={64} className="mx-auto text-slate-100 mb-6" />
                                                <p className="text-slate-400 font-bold uppercase tracking-[4px]">No daily journals recorded.</p>
                                            </div>
                                        ) : (
                                            updates.map((update, i) => (
                                                <div key={update._id} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#9A4A17] font-black text-lg shadow-inner">
                                                                {new Date(update.date).getDate()}
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Date</p>
                                                                <p className="text-sm font-black text-slate-900 uppercase">{new Date(update.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Logged</p>
                                                            <p className="text-sm font-black text-[#9A4A17] uppercase">{update.timeSpent}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-6 shadow-inner">
                                                        <p className="text-[8px] font-black text-[#9A4A17] uppercase tracking-widest mb-2 leading-none">Activity Description</p>
                                                        <p className="text-slate-600 font-bold text-sm leading-relaxed italic">"{update.workDone}"</p>
                                                    </div>
                                                    {(update.images?.length > 0 || update.links?.length > 0) && (
                                                        <div className="flex flex-wrap gap-3">
                                                            {update.images?.map((img, idx) => (
                                                                <a href={img} target="_blank" rel="noreferrer" key={idx} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer">
                                                                    <img src={img} className="w-full h-full object-cover" alt="Artifact" />
                                                                </a>
                                                            ))}
                                                            {update.links?.map((link, idx) => (
                                                                <a key={idx} href={link} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-[#9A4A17] flex items-center justify-center text-white hover:bg-slate-900 transition-all scale-100 hover:scale-110 shadow-lg shadow-amber-900/10">
                                                                    <LinkIcon size={16} />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'performance' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                        <BarChart2 className="text-[#9A4A17]" size={24} />
                                        <span>Weekly Performance Reports</span>
                                    </h3>
                                    <div className="space-y-8">
                                        {reports.length === 0 ? (
                                            <div className="py-20 text-center bg-white rounded-[48px] border-dashed border-2 border-slate-200">
                                                <FileText size={64} className="mx-auto text-slate-100 mb-6" />
                                                <p className="text-slate-400 font-bold uppercase tracking-[4px]">No weekly reports submitted.</p>
                                            </div>
                                        ) : (
                                            reports.map((report) => (
                                                <div key={report._id} className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-200 shadow-2xl relative overflow-hidden group">
                                                    <div className="flex flex-col lg:flex-row justify-between gap-12 border-b border-slate-100 pb-10 mb-10">
                                                        <div className="flex items-center space-x-6">
                                                            <div className="w-20 h-20 bg-[#9A4A17] rounded-[24px] flex items-center justify-center text-white shadow-xl">
                                                                <Target size={36} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-2 leading-none">Certification Period</p>
                                                                <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                                                    {new Date(report.weekStartDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} — {new Date(report.weekEndDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 items-center">
                                                            <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[3px] shadow-lg ${
                                                                report.status === 'Verified' ? 'bg-indigo-50 text-indigo-600' :
                                                                report.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                                report.status === 'Correction Requested' ? 'bg-amber-50 text-amber-600' :
                                                                report.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                                'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {report.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                        <div className="lg:col-span-2 space-y-8">
                                                            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
                                                                <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-widest mb-4 flex items-center"><Target size={14} className="mr-2" /> Academic Summary</p>
                                                                <p className="text-slate-600 font-bold leading-relaxed">{report.summary}</p>
                                                            </div>
                                                            {report.technologiesUsed?.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {report.technologiesUsed.map((tech, i) => (
                                                                        <span key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">{tech}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-8">
                                                            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Institutional Plan</p>
                                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">"{report.nextWeekPlan}"</p>
                                                            </div>
                                                            {report.secretaryFeedback && (
                                                                <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#9A4A17]/20 rounded-full blur-xl mr-4 mt-4"></div>
                                                                    <p className="text-[10px] font-black text-[#9A4A17] uppercase tracking-[3px] mb-3">Faculty Remarks</p>
                                                                    <p className="font-bold tracking-tight text-slate-200 leading-relaxed text-sm">"{report.secretaryFeedback}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                        <Trophy className="text-[#9A4A17]" size={24} />
                                        <span>Honors & Achievements</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {events.length === 0 ? (
                                            <div className="col-span-3 py-20 text-center bg-white rounded-[48px] border-dashed border-2 border-slate-200">
                                                <Shield size={64} className="mx-auto text-slate-100 mb-6" />
                                                <p className="text-slate-400 font-bold uppercase tracking-[4px]">No achievements documented.</p>
                                            </div>
                                        ) : (
                                            events.map((event) => (
                                                <div key={event._id} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden h-fit">
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#9A4A17]/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-[#9A4A17]/10 transition-colors"></div>
                                                    <div className="flex flex-col h-full space-y-6">
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-14 h-14 bg-amber-50 rounded-[20px] flex items-center justify-center text-[#9A4A17] shadow-inner group-hover:scale-110 transition-transform">
                                                                <Trophy size={28} />
                                                            </div>
                                                            <span className="px-4 py-2 bg-slate-50 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                                {event.type}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-[#9A4A17] uppercase tracking-widest mb-1 leading-none">{event.organizer}</p>
                                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2">{event.eventName}</h4>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Accomplished {new Date(event.date).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-3 italic mb-6">"{event.description}"</p>
                                                        </div>
                                                        {event.certificateUrl && (
                                                            <a href={event.certificateUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-slate-900 hover:bg-[#9A4A17] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 shadow-slate-900/20">
                                                                <Target size={16} />
                                                                <span>View Certification</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'attendance' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center space-x-4">
                                        <Calendar className="text-[#9A4A17]" size={24} />
                                        <span>Attendance Record Statistics</span>
                                    </h3>
                                    <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-200 shadow-2xl relative overflow-hidden group">
                                        {attendance.length === 0 ? (
                                            <div className="text-center py-10">
                                                <AlertCircle size={48} className="mx-auto text-slate-200 mb-6" />
                                                <p className="text-slate-400 font-bold uppercase tracking-[4px]">No attendance metrics available.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] text-center shadow-inner">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Authorized Shifts</p>
                                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{attendance.length}</p>
                                                </div>
                                                <div className="p-8 bg-white border border-slate-100 rounded-[40px] text-center shadow-sm">
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Logged (Present)</p>
                                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{attendance.filter(a => a.status === 'Present').length}</p>
                                                </div>
                                                <div className="p-8 bg-white border border-slate-100 rounded-[40px] text-center shadow-sm">
                                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Institutional Absence</p>
                                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{attendance.filter(a => a.status === 'Absent').length}</p>
                                                </div>
                                                <div className="p-8 bg-[#9A4A17] rounded-[40px] text-center shadow-2xl">
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">Calculated Rate</p>
                                                    <p className="text-5xl font-black text-white tracking-tighter">{Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)}%</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudentPortfolio;

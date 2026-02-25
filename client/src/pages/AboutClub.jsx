import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Mail,
    Instagram,
    Linkedin,
    Award,
    Zap,
    Cpu,
    User,
    MessageCircle,
    ShieldCheck,
    Briefcase
} from 'lucide-react';

const AboutClub = () => {
    const [clubInfo, setClubInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data } = await axios.get('/api/club-info');
                setClubInfo(data);
            } catch (err) {
                console.error('About Club fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 font-['Outfit']">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    const info = {
        description: clubInfo?.description || 'Industry 5.0 Club is a professional community focused on the future of technology, innovation, and human-centric industrial transformation.',
        chairperson: clubInfo?.chairperson || 'Vishnu Prasad A',
        secretaries: (clubInfo?.secretaries && clubInfo.secretaries.length > 0) ? clubInfo.secretaries : ['E. Yuvabharathi', 'R. Ruth Shobitha', 'Sruthi'],
        staff: clubInfo?.staff || [],
        email: clubInfo?.email || 'industry5club@gmail.com',
        instagram: clubInfo?.instagram || 'jit_industry5.0_club',
        linkedin: clubInfo?.linkedin || 'https://www.linkedin.com/in/industry-5-0-club-9b34263a8'
    };

    return (
        <div className="space-y-10 pb-20 font-['Outfit']">
            <header className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#92400E]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-8 rounded-full shadow-lg border-4 border-white" />
                <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Industry 5.0 Club</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-3 opacity-60">Jeppiaar Institute of Technology</p>
                <div className="h-1 w-20 bg-[#92400E] mx-auto rounded-full mt-8"></div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Zap size={20} className="text-[#92400E]" />
                            </div>
                            Club Architecture
                        </h2>
                        <div className="text-slate-600 text-lg leading-relaxed space-y-6">
                            {(info.description || '').split('\n').map((line, i) => (
                                line.trim() ? <p key={i} className="font-medium">{line}</p> : <div key={i} className="h-4" />
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-10">
                    <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-10 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#92400E]" />
                            Personnel Matrix
                        </h3>

                        <div className="space-y-10">
                            {/* Chairperson */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#92400E] uppercase tracking-widest">Chairperson</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                        <User size={20} className="text-slate-900" />
                                    </div>
                                    <p className="font-black text-slate-900 uppercase tracking-tight">{info.chairperson}</p>
                                </div>
                            </div>

                            {/* Staff */}
                            {info.staff.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-[#92400E] uppercase tracking-widest">Staff Coordinators</p>
                                    <div className="space-y-3">
                                        {info.staff.map((s, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <Briefcase size={14} />
                                                </div>
                                                <p className="font-bold text-slate-700 text-sm uppercase tracking-tight">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Secretaries */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#92400E] uppercase tracking-widest">Secretaries</p>
                                <div className="space-y-3">
                                    {info.secretaries.map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <Award size={14} />
                                            </div>
                                            <p className="font-bold text-slate-700 text-sm uppercase tracking-tight">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900 p-10 rounded-[48px] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[4px] mb-8 opacity-40">Contact Nexus</h3>
                        <div className="space-y-5">
                            <a href={`mailto:${info.email}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                <Mail size={16} className="text-[#92400E]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">{info.email}</span>
                            </a>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <Instagram size={16} className="text-[#92400E]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">@{info.instagram}</span>
                            </div>
                            <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                <Linkedin size={16} className="text-[#92400E]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">LinkedIn</span>
                            </a>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default AboutClub;

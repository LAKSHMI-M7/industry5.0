import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Calendar, BarChart2, Shield, Cpu, Activity, Globe, Zap, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Student List',
            description: 'View student profiles and their academic details.',
            icon: <Users size={28} />,
            color: 'text-[#92400E]',
            bg: 'bg-amber-50',
            path: '/students-list',
            buttonText: 'View Students'
        },
        {
            title: 'Attendance',
            description: 'Track student attendance and participation.',
            icon: <Calendar size={28} />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            path: '/attendance-report',
            buttonText: 'View Attendance'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-['Outfit']">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Staff Dashboard</h1>
                    <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Manage and track student progress.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md px-10 py-5 rounded-[28px] border border-white shadow-xl flex items-center space-x-4">
                    <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 rounded-full" />
                    <span className="text-slate-900 font-black uppercase tracking-[3px] text-xs">Staff Access</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {modules.map((module, i) => (
                    <motion.div
                        key={module.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                        onClick={() => navigate(module.path)}
                        className="glass-strong p-12 rounded-[56px] border-white shadow-2xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 group cursor-pointer relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-[0.03] group-hover:scale-125 transition-all duration-1000 pointer-events-none">
                            {React.cloneElement(module.icon, { size: 180 })}
                        </div>

                        <div className="flex-grow">
                            <div className={`${module.bg} ${module.color} p-6 rounded-[28px] w-fit mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-white/50`}>
                                {module.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">{module.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed mb-10 uppercase tracking-wide text-xs">{module.description}</p>
                        </div>

                        <div className="pt-8 border-t border-slate-100/50 flex items-center justify-between">
                            <span className={`${module.color} font-black text-[11px] uppercase tracking-[4px] flex items-center group-hover:translate-x-2 transition-transform duration-500`}>
                                {module.buttonText} <ArrowRight size={16} className="ml-3" />
                            </span>
                            <div className="flex -space-x-3 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="glass-strong p-16 rounded-[64px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.08)] text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#92400E]/20 to-transparent"></div>
                <div className="p-8 bg-amber-50/50 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-10 border border-amber-100/50 shadow-inner group transition-all duration-700 hover:scale-110">
                    <BookOpen size={48} className="text-[#92400E] opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Additional features coming soon</h2>
                <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-[2px] text-xs">
                    We are working on bringing more tools to the staff dashboard. Access student lists and attendance reports from the sidebar.
                </p>
            </motion.div>
            <div className="mt-12 flex justify-center space-x-6">
                {[Zap, Cpu, Globe].map((Icon, i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                        <Icon size={20} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffDashboard;

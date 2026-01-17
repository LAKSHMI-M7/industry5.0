import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Calendar, BarChart2 } from 'lucide-react';

const StaffDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Staff Portal</h1>
                <p className="text-slate-400">Collaborate and manage club activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5 group hover:border-accent/30 transition-all">
                    <div className="p-3 bg-accent/20 rounded-2xl w-fit mb-6 text-accent">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Student Records</h3>
                    <p className="text-slate-400 text-sm mb-6">Access student profiles, domain expertise, and contact information.</p>
                    <button className="text-accent font-bold text-sm hover:underline flex items-center">
                        Open Directory <BarChart2 size={16} className="ml-2" />
                    </button>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 group hover:border-green-500/30 transition-all">
                    <div className="p-3 bg-green-500/20 rounded-2xl w-fit mb-6 text-green-500">
                        <Calendar size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Events & Attendance</h3>
                    <p className="text-slate-400 text-sm mb-6">Monitor attendance trends and upcoming club session schedules.</p>
                    <button className="text-green-500 font-bold text-sm hover:underline flex items-center">
                        View Schedule <BarChart2 size={16} className="ml-2" />
                    </button>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/5 text-center px-12">
                <div className="p-4 bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Book size={32} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Under Active Development</h2>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                    We are currently building advanced reporting tools for staff members.
                    You can still use the sidebar to access student directories and reports.
                </p>
            </div>
        </div>
    );
};

export default StaffDashboard;

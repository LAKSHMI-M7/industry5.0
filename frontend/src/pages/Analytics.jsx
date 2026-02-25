import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp,
    Info,
    BarChart3,
    PieChart as PieIcon,
    RefreshCw,
    Activity,
    LineChart as LineIcon,
    Zap,
    Cpu,
    Globe,
    Layers,
    Users,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('/api/admin/analytics');
                setData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="dashboard-gradient min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
                <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#92400E] animate-pulse" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[6px] animate-pulse">Calculating analytics data...</p>
        </div>
    );

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Performance Analytics</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Track and analyze student engagement and performance.</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="glass px-6 py-3 rounded-2xl flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">Live Feed Active</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Total Students', value: data?.totalStudents || 0, icon: <Users size={20} />, trend: '+12%', color: 'text-[#92400E]', bg: 'bg-amber-50' },
                        { label: 'Engagement Rate', value: `${data?.engagementRate || 0}%`, icon: <Zap size={20} />, trend: '+5.4%', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Student Participation', value: data?.totalParticipations || 0, icon: <ShieldCheck size={20} />, trend: '+28%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Response Time', value: '4.8s', icon: <TrendingUp size={20} />, trend: '-0.2s', color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="glass-strong p-8 rounded-[40px] border-white shadow-xl hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 ${stat.bg} ${stat.color} rounded-[20px] group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Activity Trends</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Student activity levels over the current cycle</p>
                            </div>
                        </div>
                        <div className="h-[400px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.activityTrends || []}>
                                    <defs>
                                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#92400E" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#92400E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                        itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="updates"
                                        stroke="#92400E"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorEngagement)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-strong p-10 md:p-14 rounded-[56px] border-white shadow-2xl">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Domain Distribution</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-12">Students grouped by technical domain</p>

                        <div className="h-[300px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.domainDistribution || []}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {(data?.domainDistribution || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#92400E', '#0F172A', '#451A03', '#1E293B'][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <p className="text-3xl font-black text-slate-900">{data?.totalStudents || 0}</p>
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Total Students</p>
                            </div>
                        </div>

                        <div className="space-y-4 mt-12">
                            {(data?.domainDistribution || []).map((entry, index) => (
                                <div key={entry.name} className="flex justify-between items-center group cursor-default">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#92400E', '#0F172A', '#451A03', '#1E293B'][index % 4] }}></div>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{entry.name}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-strong p-12 md:p-16 rounded-[64px] border-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#92400E]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="w-16 h-16 bg-amber-50 rounded-[24px] flex items-center justify-center text-[#92400E] mb-8 shadow-inner">
                                <Cpu size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">Performance Summary</h2>
                            <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg italic">"Student engagement metrics show an upward trajectory in activity. We recommend encouraging consistent updates to maintain institutional progress."</p>
                            <div className="flex space-x-6">
                                <button className="px-10 py-5 bg-[#92400E] text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all">Download Report</button>
                                <button className="px-10 py-5 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:scale-105 active:scale-95 transition-all">Archive Data</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Server Load', val: '24%', color: 'bg-emerald-500' },
                                { label: 'System Uptime', val: '99.9%', color: 'bg-[#92400E]' },
                                { label: 'Database Health', val: 'Optimal', color: 'bg-blue-500' },
                                { label: 'Network Load', val: 'Light', color: 'bg-purple-500' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/40 border border-white p-8 rounded-[32px] shadow-sm">
                                    <div className={`w-1.5 h-6 ${item.color} rounded-full mb-4`}></div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-xl font-black text-slate-900 uppercase">{item.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

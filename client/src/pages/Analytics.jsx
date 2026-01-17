import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TrendingUp,
    Info,
    BarChart3,
    PieChart as PieIcon,
    RefreshCw,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/analytics');
                setData(data);
            } catch (err) {
                console.error('Error fetching analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <RefreshCw className="animate-spin text-accent" size={40} />
            <p className="text-slate-400 animate-pulse font-medium">Synchronizing club intelligence...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-bold font-outfit">System Analytics</h1>
                <p className="text-slate-400">Deep dive into club performance and engagement</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Engagement Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center">
                            <Activity className="mr-3 text-accent" size={20} /> Activity Trends
                        </h3>
                        <div className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-bold text-accent uppercase tracking-wider">
                            Last 7 Days
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.activityTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                                />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="updates"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Domain Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center">
                            <PieIcon className="mr-3 text-green-500" size={20} /> Domain Alpha
                        </h3>
                        <div className="px-3 py-1 bg-green-500/10 rounded-full text-[10px] font-bold text-green-500 uppercase tracking-wider">
                            Live Split
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.domainDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data?.domainDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {data?.domainDistribution.map((entry, index) => (
                            <div key={entry.name} className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{entry.name}</span>
                                <span className="text-[10px] text-white font-bold ml-auto">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Insight Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-accent/10 border border-accent/20 p-8 rounded-[2.5rem] flex items-start space-x-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <TrendingUp size={120} />
                </div>

                <div className="p-4 bg-accent/20 rounded-2xl text-accent relative z-10">
                    <Info size={28} />
                </div>
                <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-1 font-outfit uppercase tracking-wider text-xs opacity-50">Club Intelligence Insight</h4>
                    <p className="text-slate-200 text-lg leading-relaxed font-medium max-w-2xl">
                        Based on the latest data sync, <span className="text-accent underline decoration-2 underline-offset-4">Engagement Stability</span> is at 84%.
                        The club is showing strong growth in <span className="text-white font-bold italic">Technical Submissions</span> this quarter.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;

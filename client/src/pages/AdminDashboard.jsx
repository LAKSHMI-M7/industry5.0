import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Shield,
    BookOpen,
    TrendingUp,
    Activity,
    CheckCircle,
    FileText,
    Settings,
    UserCheck,
    AlertCircle,
    ChevronRight,
    Lock,
    Terminal,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showAudit, setShowAudit] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [auditLoading, setAuditLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(data);
            } catch (err) {
                console.error('Error fetching admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fetchAudit = async () => {
        setAuditLoading(true);
        setShowAudit(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/audit');
            setAuditData(data);
        } catch (err) {
            console.error('Audit failed', err);
        } finally {
            setAuditLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent border-r-2"></div>
        </div>
    );

    const statCards = [
        { label: 'Total Users', value: stats?.users?.total, icon: <Users className="text-blue-400" />, detail: `${stats?.users?.students} Students, ${stats?.users?.secretaries} Secretaries`, path: '/manage-users' },
        { label: 'Attendance Today', value: stats?.activity?.attendanceToday, icon: <UserCheck className="text-green-400" />, detail: 'Real-time check-ins', path: '/manage-attendance' },
        { label: 'Daily Updates', value: stats?.activity?.dailyUpdates, icon: <Activity className="text-purple-400" />, detail: 'Continuous updates', path: '/manage-updates' },
        { label: 'Weekly Reports', value: stats?.activity?.weeklyReports, icon: <FileText className="text-orange-400" />, detail: 'Performance tracking', path: '/manage-reports' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Admin Console</h1>
                    <p className="text-slate-400">Complete system oversight and analytics</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                    >
                        <Settings size={20} className="text-slate-400" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group cursor-pointer hover:border-accent/40 active:scale-[0.98] transition-all"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all">
                            {React.cloneElement(item.icon, { size: 64 })}
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl w-fit mb-4 group-hover:bg-accent/10 transition-colors">{item.icon}</div>
                        <p className="text-slate-500 text-sm font-medium">{item.label}</p>
                        <h3 className="text-3xl font-bold mt-1">{item.value || 0}</h3>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                            <TrendingUp size={12} className="mr-1 text-green-500" />
                            {item.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Role Distribution</h3>
                            <button onClick={() => navigate('/manage-users')} className="text-xs text-accent font-bold hover:underline">View All Users</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { role: 'Students', count: stats?.users?.students, color: 'bg-blue-500' },
                                { role: 'Secretaries', count: stats?.users?.secretaries, color: 'bg-green-500' },
                                { role: 'Staff Members', count: stats?.users?.staff, color: 'bg-purple-500' },
                                { role: 'Club Leaders', count: stats?.users?.leaders, color: 'bg-orange-500' },
                                { role: 'Admins', count: stats?.users?.total - (stats?.users?.students + stats?.users?.secretaries + stats?.users?.staff + stats?.users?.leaders), color: 'bg-slate-500' },
                            ].map((row) => (
                                <div key={row.role}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{row.role}</span>
                                        <span className="text-slate-400">{row.count || 0} users</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats?.users?.total > 0 ? (row.count / stats?.users?.total) * 100 : 0}%` }}
                                            className={`h-full ${row.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-accent/20 rounded-lg text-accent">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-xl font-bold">System Health</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center space-x-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Database</p>
                                    <p className="text-sm font-semibold">MongoDB Atlas - Operational</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center space-x-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">File Storage</p>
                                    <p className="text-sm font-semibold">Active - 84% Free</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-accent/10 border border-accent/20 p-8 rounded-3xl relative overflow-hidden">
                        <Shield className="absolute -right-4 -bottom-4 text-accent/10" size={120} />
                        <h4 className="text-lg font-bold mb-2">Admin Security</h4>
                        <p className="text-sm text-slate-400 mb-6 font-medium">Your account has full root access. Every sensitive action is logged for system integrity.</p>
                        <button
                            onClick={fetchAudit}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-2xl shadow-lg shadow-accent/20 transition-all text-sm flex items-center justify-center space-x-2"
                        >
                            <Terminal size={16} />
                            <span>Generate Security Audit</span>
                        </button>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h3 className="text-xl font-bold mb-6">Critical Alerts</h3>
                        <div className="space-y-4 text-sm">
                            {stats?.alerts?.length > 0 ? (
                                stats.alerts.map((alert, idx) => {
                                    const styles = {
                                        critical: 'text-red-400 bg-red-400/5 border-red-400/10',
                                        warning: 'text-orange-400 bg-orange-400/5 border-orange-400/10',
                                        info: 'text-blue-400 bg-blue-400/5 border-blue-400/10',
                                    };
                                    return (
                                        <div key={idx} className={`flex items-start space-x-3 p-3 rounded-xl border ${styles[alert.type]}`}>
                                            <AlertCircle size={18} className="shrink-0" />
                                            <p>{alert.message}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex items-start space-x-3 text-green-400 p-3 bg-green-400/5 rounded-xl border border-green-400/10">
                                    <CheckCircle size={18} className="shrink-0" />
                                    <p>All systems running smoothly. No critical alerts.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass max-w-lg w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-2xl font-bold flex items-center">
                                    <Settings className="mr-3 text-accent" size={24} /> System Registry
                                </h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <AlertCircle className="rotate-45" />
                                </button>
                            </div>

                            <p className="text-slate-400 text-sm">Detailed breakdown of all active members by role assignment.</p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Total Students', value: stats?.users?.students, icon: <Users size={18} />, color: 'text-blue-400', bg: 'bg-blue-400/10', role: 'student' },
                                    { label: 'Staff Members', value: stats?.users?.staff, icon: <Shield size={18} />, color: 'text-purple-400', bg: 'bg-purple-400/10', role: 'staff' },
                                    { label: 'Club Secretaries', value: stats?.users?.secretaries, icon: <UserCheck size={18} />, color: 'text-green-400', bg: 'bg-green-500/10', role: 'secretary' },
                                    { label: 'Club Leaders', value: stats?.users?.leaders, icon: <Shield className="rotate-180" size={18} />, color: 'text-orange-400', bg: 'bg-orange-400/10', role: 'leader' },
                                ].map((row) => (
                                    <div
                                        key={row.label}
                                        onClick={() => {
                                            setShowSettings(false);
                                            navigate(`/manage-users?role=${row.role}`);
                                        }}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 hover:border-accent/30 cursor-pointer transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2.5 ${row.bg} ${row.color} rounded-xl`}>
                                                {row.icon}
                                            </div>
                                            <div>
                                                <span className="font-semibold block">{row.label}</span>
                                                <span className="text-[10px] text-slate-500 flex items-center">
                                                    Click to view detailed list <ChevronRight size={10} className="ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold">{row.value || 0}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowSettings(false)}
                                className="w-full bg-accent text-white font-bold py-4 rounded-2xl shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Close Registry
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Security Audit Modal */}
            {showAudit && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass max-w-2xl w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Security Log</h3>
                                        <p className="text-xs text-green-500 font-bold flex items-center">
                                            <CheckCircle size={10} className="mr-1" /> SYSTEM SECURE
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAudit(false)}
                                    className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                                >
                                    <AlertCircle className="rotate-45" size={24} />
                                </button>
                            </div>

                            {auditLoading ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <RefreshCw className="animate-spin text-accent" size={32} />
                                    <p className="text-slate-400 animate-pulse font-medium">Scanning system records...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                                            <p className="font-bold text-green-500">{auditData?.systemStatus || 'Secure'}</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Firewall</p>
                                            <p className="font-bold text-accent">{auditData?.firewall || 'Active'}</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Last Backup</p>
                                            <p className="font-bold text-slate-300">24h ago</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Recent Activity Logs</p>
                                        <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {auditData?.logs?.map((log, idx) => (
                                                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-bold text-white">{log.event}</p>
                                                        <span className="text-[10px] font-mono text-slate-500">{log.ip}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mb-2">{log.details}</p>
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">{log.status}</span>
                                                        <span className="text-slate-600 font-medium">{new Date(log.timestamp).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowAudit(false)}
                                className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-4 rounded-2xl transition-all"
                            >
                                Close Audit Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

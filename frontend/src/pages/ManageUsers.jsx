import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Shield,
    Mail,
    Search,
    MoreVertical,
    ChevronRight,
    UserCheck,
    UserPlus,
    Filter,
    ShieldAlert,
    ShieldCheck,
    Cpu,
    Fingerprint,
    Activity,
    Lock,
    X,
    Hash,
    Building2,
    Calendar,
    Globe,
    Key,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const ManageUsers = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState(initialRole || 'all');

    // Create/Edit User Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        email: '',
        department: '',
        year: 'I',
        domain: '',
        role: 'student',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users');
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = async (u) => {
        setSelectedUser(u);
        setIsEditing(true);
        let extraFields = {};
        if (u.role === 'student') {
            try {
                const { data } = await axios.get(`/api/secretary/students/${u._id}`);
                extraFields = {
                    registerNumber: data.registerNumber || '',
                    department: data.department || '',
                    year: data.year || 'I',
                    domain: data.domain || '',
                };
            } catch (err) {
                console.error('Profile fetch failed', err);
            }
        }

        setFormData({
            name: u.name,
            email: u.email,
            role: u.role,
            password: '', // Don't show password
            ...extraFields
        });
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you absolutely sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete identity');
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');
        setSuccess('');

        try {
            if (isEditing) {
                await axios.put(`/api/admin/users/${selectedUser._id}`, formData);
                setSuccess('User profile updated successfully.');
            } else {
                await axios.post('/api/admin/users', formData);
                setSuccess('User registered successfully.');
            }

            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess('');
                fetchUsers();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error: Failed to register user.');
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = activeRole === 'all' || u.role === activeRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-red-50 text-red-600 border-red-100',
            secretary: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            student: 'bg-amber-50 text-[#92400E] border-amber-100',
            staff: 'bg-blue-50 text-blue-600 border-blue-100',
            leader: 'bg-slate-900 text-white border-slate-900',
        };
        return <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${styles[role] || 'bg-slate-100 text-slate-500'}`}>{role}</span>;
    };

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit']">
            <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase leading-none">User Management</h1>
                        <p className="text-slate-500 font-bold ml-1 uppercase tracking-widest text-sm">Manage all student, faculty, and administrative accounts.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#92400E] transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/60 border border-slate-200/60 rounded-[28px] py-4 pl-14 pr-8 focus:bg-white focus:ring-[12px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold w-full sm:w-80 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    registerNumber: '',
                                    email: '',
                                    department: '',
                                    year: 'I',
                                    domain: '',
                                    role: 'student',
                                    password: ''
                                });
                                setIsEditing(false);
                                setIsModalOpen(true);
                            }}
                            className="w-full sm:w-auto bg-[#92400E] hover:bg-[#78350F] text-white px-8 py-4 rounded-[28px] font-black flex items-center justify-center space-x-3 shadow-xl shadow-amber-900/20 hover:-translate-y-1 transition-all uppercase text-[10px] tracking-[3px]"
                        >
                            <UserPlus size={18} />
                            <span>Create New User</span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-wrap gap-3 bg-white/40 p-2.5 rounded-[32px] border border-white shadow-inner w-fit">
                    {['all', 'student', 'staff', 'secretary', 'admin'].map(role => (
                        <button
                            key={role}
                            onClick={() => setActiveRole(role)}
                            className={`px-8 py-3.5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeRole === role ? 'bg-[#92400E] text-white shadow-xl shadow-amber-900/30' : 'text-slate-500 hover:bg-white hover:text-[#92400E]'}`}
                        >
                            {role === 'all' ? 'All Users' : `${role}s`}
                        </button>
                    ))}
                </div>

                <div className="glass-strong rounded-[56px] border-white shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
                        <Fingerprint size={120} className="text-[#92400E]" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[4px] uppercase border-b border-slate-100">Name</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[4px] uppercase border-b border-slate-100">Role</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[4px] uppercase border-b border-slate-100 text-center">Edit</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 tracking-[4px] uppercase border-b border-slate-100 text-right">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="px-10 py-10"><div className="h-16 bg-slate-100/50 rounded-3xl w-full"></div></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-24 text-center">
                                            <ShieldAlert size={64} className="mx-auto text-slate-200 mb-6" />
                                            <p className="text-slate-400 font-black uppercase tracking-[4px]">No users found matching your search.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/60 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="relative">
                                                        <img
                                                            src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=92400E&color=fff&bold=true`}
                                                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                                            alt="Avatar"
                                                        />
                                                        {u.isFirstLogin && (
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full" title="New Account - Sync Pending"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase mb-2">{u.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none flex items-center">
                                                            <Mail size={12} className="mr-1.5 opacity-50" />
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                {getRoleBadge(u.role)}
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="flex justify-center group/btn">
                                                    <button
                                                        onClick={() => handleOpenEdit(u)}
                                                        className="px-6 py-3 bg-white border border-slate-100 text-slate-400 group-hover/btn:text-[#92400E] group-hover/btn:border-[#92400E]/20 group-hover/btn:bg-amber-50/50 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:shadow-lg flex items-center space-x-2"
                                                    >
                                                        <Activity size={14} />
                                                        <span>Edit User</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:shadow-xl hover:-translate-y-1 rounded-2xl transition-all shadow-sm"
                                                        title="Terminate Identity"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="flex flex-col md:flex-row justify-between items-center px-10 py-12 glass shadow-xl rounded-[48px] border-white">
                    <div className="flex items-center space-x-4 mb-6 md:mb-0">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#92400E] shadow-sm">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{filteredUsers.length} Users Listed</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Filter Active: {activeRole}</p>
                        </div>
                    </div>
                    <div className="flex space-x-8">
                        <div className="text-center">
                            <p className="text-xl font-black text-slate-900">100%</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Consistency</p>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div className="text-center">
                            <p className="text-xl font-black text-[#92400E]">REAL-TIME</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Synchronization</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Create User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white/40"
                        >
                            <div className="p-10 md:p-14">
                                <header className="flex justify-between items-start mb-12">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">
                                            {isEditing ? 'Edit User' : 'Create User'}
                                        </h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                            {isEditing ? 'Update user profile and permissions.' : 'Register a new user in the portal.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400"
                                    >
                                        <X size={24} />
                                    </button>
                                </header>

                                {error && (
                                    <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[24px] flex items-center space-x-4 text-red-600">
                                        <ShieldAlert size={20} className="shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100 rounded-[24px] flex items-center space-x-4 text-emerald-600">
                                        <CheckCircle2 size={20} className="shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-widest">{success}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Full Name</label>
                                        <div className="relative group">
                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                placeholder="institutional@jit.edu"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">User Role</label>
                                        <div className="relative group">
                                            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                            <select
                                                required
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                                            >
                                                <option value="student">Student</option>
                                                <option value="secretary">Secretary</option>
                                                <option value="staff">Staff</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={18} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Initial Password</label>
                                        <div className="relative group">
                                            <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required={!isEditing}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                placeholder={isEditing ? "(Unchanged)" : "Set initial password"}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {formData.role === 'student' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100"
                                            >
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Register Number</label>
                                                    <div className="relative group">
                                                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            required={formData.role === 'student'}
                                                            value={formData.registerNumber}
                                                            onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                                                            className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                            placeholder="Register Number"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Department</label>
                                                    <div className="relative group">
                                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            required={formData.role === 'student'}
                                                            value={formData.department}
                                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                            className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                            placeholder="Department Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Academy Year</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                                        <select
                                                            required={formData.role === 'student'}
                                                            value={formData.year}
                                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                            className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                                                        >
                                                            <option value="I">Year I</option>
                                                            <option value="II">Year II</option>
                                                            <option value="III">Year III</option>
                                                            <option value="IV">Year IV</option>
                                                        </select>
                                                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={18} />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Domain / Interest</label>
                                                    <div className="relative group">
                                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                                                        <input
                                                            type="text"
                                                            required={formData.role === 'student'}
                                                            value={formData.domain}
                                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                                            className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[24px] py-4 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold"
                                                            placeholder="e.g. Web Development"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="col-span-1 md:col-span-2 pt-8">
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-[#92400E] hover:bg-[#78350F] text-white py-5 rounded-[28px] font-black flex items-center justify-center space-x-3 shadow-2xl shadow-amber-900/40 hover:-translate-y-1 transition-all uppercase text-[11px] tracking-[4px] disabled:opacity-50 disabled:translate-y-0"
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <UserCheck size={20} />
                                                    <span>{isEditing ? 'Save Changes' : 'Register User'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsers;

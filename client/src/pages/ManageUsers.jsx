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
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const ManageUsers = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRole, setActiveRole] = useState(initialRole || 'all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/users');
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update role');
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
            admin: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            secretary: 'bg-green-500/10 text-green-500 border-green-500/20',
            student: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            staff: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            leader: 'bg-accent/10 text-accent border-accent/20',
        };
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[role] || 'bg-slate-500/10 text-slate-500'}`}>{role}</span>;
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-slate-400">Control system access and assign roles</p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['all', 'student', 'staff', 'secretary', 'leader'].map(role => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${activeRole === role ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                {role}s
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-accent outline-none text-sm w-96"
                        />
                    </div>
                </div>
            </header>

            <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">USER</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">CURRENT ROLE</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">PERMISSIONS</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt="" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(u.role)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-xs outline-none focus:ring-1 focus:ring-accent appearance-none cursor-pointer pr-8"
                                            >
                                                <option value="student">Student</option>
                                                <option value="secretary">Secretary</option>
                                                <option value="staff">Staff</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;

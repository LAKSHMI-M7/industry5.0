import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, LogIn, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { changePassword, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await changePassword(password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen dashboard-gradient flex items-center justify-center p-6 font-['Outfit']">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-10 md:p-14 glass-strong rounded-[48px] shadow-2xl border border-white/40"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#92400E] rounded-[28px] flex items-center justify-center shadow-2xl shadow-amber-900/40 mx-auto mb-8">
                        <KeyRound size={36} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">Security Synchronization</h2>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
                        First-time access detected. Please establish your private access credentials to proceed.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
                        <ShieldAlert size={18} className="shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">New Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/60 border border-slate-200/60 rounded-[24px] py-4.5 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                placeholder="Enter secure password"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Confirm Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/60 border border-slate-200/60 rounded-[24px] py-4.5 pl-12 pr-6 focus:bg-white focus:ring-[10px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#92400E] hover:bg-[#78350F] text-white font-black py-5 rounded-[24px] shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group uppercase tracking-[4px] text-[10px] mt-8"
                    >
                        <span>Update Credentials</span>
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={logout}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-[24px] transition-all uppercase tracking-[4px] text-[9px]"
                    >
                        Abort Synchronization
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePassword;

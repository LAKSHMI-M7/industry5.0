import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert, BadgeInfo } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.isFirstLogin) {
                navigate('/change-password');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="login-wrapper bg-[#F8FAFC] font-['Outfit']">
            <div className="login-content relative overflow-hidden">
                {/* Background Radial Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>

                {/* Left Panel: Branding */}
                <div className="hidden lg:flex login-left relative overflow-hidden p-12 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        <div className="space-y-4">
                            <div className="flex flex-col mb-4">
                                <p className="text-[44px] font-serif font-black text-slate-900 leading-none mb-2 uppercase">
                                    JEPPIAAR INSTITUTE OF TECHNOLOGY
                                </p>
                                <div className="h-[3px] w-32 bg-[#92400E]"></div>
                            </div>

                            <div className="flex items-center mb-2">
                                <img
                                    src="/assets/logo.png"
                                    alt="Industry 5.0 Logo"
                                    className="club-logo"
                                />
                                <h2 className="text-2xl font-black text-[#92400E] tracking-tight leading-none">Industry 5.0 Club Portal</h2>
                            </div>

                            <p className="text-sm font-bold text-slate-400 ml-[66px]">
                                Student Activity & Academic Tracking System
                            </p>
                        </div>

                        <div className="flex items-center space-x-4 mt-12 ml-[86px]">
                            <div className="h-10 w-px bg-slate-200"></div>
                            <p className="text-[10px] font-black text-slate-400 leading-tight">Official Institutional<br />Security Protocol</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel: Login Card */}
                <div className="w-full login-right z-10 text-center p-4">
                    <div className="lg:hidden w-full text-center mb-10">
                        <p className="text-[#92400E] font-black text-[12px] mb-2 font-serif uppercase">JEPPIAAR INSTITUTE OF TECHNOLOGY</p>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Industry 5.0 Club Portal</h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-[450px] p-10 md:p-12 rounded-[48px] shadow-xl bg-white border border-slate-200/50 backdrop-blur-sm"
                    >
                        <div className="mb-10 w-full text-center">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-3">Sign in to your account</h2>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="w-full mb-8 p-5 bg-red-50 border border-red-100 rounded-[24px] flex items-center space-x-4 text-red-600"
                            >
                                <ShieldAlert size={20} className="shrink-0" />
                                <span className="text-[11px] font-black leading-none">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 ml-1">Registered email ID</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-[32px] py-5 pl-14 pr-8 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                        placeholder="your.email@jit.edu"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-400">Password</label>
                                    <Link to="#" className="text-[10px] font-black text-[#92400E] hover:underline opacity-60">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-[32px] py-5 pl-14 pr-8 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.01, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[32px] shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center space-x-4 group"
                                >
                                    <span className="text-sm">Sign In</span>
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer className="login-footer" />
        </div>
    );
};

export default Login;

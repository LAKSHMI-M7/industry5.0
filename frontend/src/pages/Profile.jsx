import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Mail, Hash, BookOpen, Layers, Github, Linkedin, Save, Phone, GraduationCap, Award, Camera, Cpu, Target, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const Profile = () => {
    const { updateUser } = useAuth();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        registerNumber: '',
        department: '',
        year: '1',
        section: '',
        semester: '',
        phone: '',
        cgpa: '',
        arrears: '',
        domain: '',
        githubLink: '',
        linkedinLink: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('/api/student/profile');
                if (data) {
                    setProfile(data);
                    setFormData({
                        registerNumber: data.registerNumber || '',
                        department: data.department || '',
                        year: data.year || '1',
                        section: data.section || '',
                        semester: data.semester || '',
                        phone: data.phone || '',
                        cgpa: data.cgpa || '',
                        arrears: data.arrears || '0',
                        domain: data.domain || '',
                        githubLink: data.githubLink || '',
                        linkedinLink: data.linkedinLink || '',
                        skills: data.skills ? data.skills.join(', ') : ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile', err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await axios.post('/api/auth/avatar', formData);
            // Update local profile state
            setProfile(prev => ({
                ...prev,
                user: { ...prev.user, avatar: data.avatar }
            }));
            // Update global auth context
            updateUser({ avatar: data.avatar });
            setMessage({ type: 'success', text: 'Photo updated successfully!' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to upload photo.';
            setMessage({ type: 'error', text: errorMsg });
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/student/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    if (!profile && loading) {
        return (
            <div className="dashboard-gradient min-h-screen flex flex-col items-center justify-center p-8 space-y-8 font-['Outfit']">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
                    <img src="/assets/logo.png" alt="Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full animate-pulse" />
                </div>
                <p className="text-slate-400 font-black animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-gradient min-h-screen p-8 md:p-12 font-['Outfit'] overflow-x-hidden">
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-8 duration-1000">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="h-[2px] w-12 bg-[#92400E]"></span>
                            <span className="text-[10px] font-black text-[#92400E]">Student registry</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Student Profile</h1>
                        <p className="text-slate-500 font-bold ml-1 text-sm italic">Please keep your profile information up to date.</p>
                    </div>
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className={`px-8 py-5 rounded-[28px] font-black text-sm border shadow-2xl flex items-center space-x-3 ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                            >
                                <div className={`w-2 h-2 rounded-full animate-ping ${message.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                <span>{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Identity Token */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-10"
                    >
                        <div className="glass-strong p-10 rounded-[56px] text-center border-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#92400E]/10 via-transparent to-slate-900/5 opacity-40"></div>
                            <div className="relative z-10">
                                <div className="relative inline-block mb-12">
                                    <div className="absolute inset-0 bg-[#92400E] blur-3xl opacity-20 rounded-full scale-110"></div>
                                    <img
                                        src={getImageUrl(profile?.user?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || 'User')}&background=92400E&color=fff&size=200&bold=true`}
                                        className="w-44 h-44 rounded-[52px] mx-auto border-8 border-white shadow-2xl object-cover hover:scale-105 hover:-rotate-3 transition-all duration-700 relative z-10"
                                        alt="Profile"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerUpload}
                                        disabled={uploading}
                                        className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-[#92400E] border-4 border-slate-50 hover:bg-[#92400E] hover:text-white transition-all z-20 group/cam disabled:opacity-50"
                                    >
                                        {uploading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <Camera size={24} className="group-hover/cam:scale-110 transition-transform" />
                                        )}
                                    </button>
                                </div>
                                <h4 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{profile?.user?.name || 'Loading data...'}</h4>
                                <div className="flex items-center justify-center space-x-3 mb-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <p className="text-[#92400E] text-[10px] font-black">{formData.domain || 'Student'}</p>
                                </div>

                                <div className="bg-slate-900/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/50 space-y-6">
                                    <div className="flex justify-between items-end border-b border-slate-200/50 pb-4">
                                        <div className="text-left">
                                            <p className="text-[8px] font-black text-slate-400 mb-1">Register number</p>
                                            <p className="text-lg font-black text-slate-900 tracking-tighter">{formData.registerNumber || 'Unassigned'}</p>
                                        </div>
                                        <Hash size={16} className="text-slate-300 mb-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-left">
                                            <p className="text-[8px] font-black text-slate-400 mb-1">CGPA</p>
                                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{formData.cgpa || '0.00'}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] font-black text-slate-400 mb-1">Arrears</p>
                                            <p className={`text-3xl font-black tracking-tighter ${parseInt(formData.arrears) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formData.arrears || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-12 rounded-[56px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
                            <h4 className="text-white font-black flex items-center space-x-5 mb-10 text-2xl tracking-tight">
                                <GraduationCap size={28} className="text-[#92400E]" />
                                <span>Academic Details</span>
                            </h4>
                            <p className="text-white/50 text-base font-bold leading-relaxed mb-10 italic">
                                "Academic records are important for your progress. Ensure all details are accurate."
                            </p>
                            <div className="flex items-center space-x-4 bg-white/5 p-6 rounded-[32px] border border-white/10">
                                <Award className="text-amber-500" size={24} />
                                <span className="text-[10px] font-black">Active student</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Execution Matrix (Form) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-strong p-10 md:p-16 rounded-[64px] border-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#92400E]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                            <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
                                <section className="space-y-10">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-xl">
                                            <Layers size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Personal Details</h3>
                                            <p className="text-[10px] font-black text-slate-400 mt-1">Enter your basic information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Register number</label>
                                            <div className="relative group">
                                                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                                <input
                                                    name="registerNumber"
                                                    required
                                                    value={formData.registerNumber}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[32px] py-5 px-16 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                                    placeholder="20XX-REG-XXX"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Department</label>
                                            <div className="relative group">
                                                <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                                <input
                                                    name="department"
                                                    required
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[32px] py-5 px-16 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                                    placeholder="e.g. Computer Science"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Academic year</label>
                                            <div className="grid grid-cols-3 gap-6">
                                                <select
                                                    name="year"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[28px] py-5 px-6 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#924000] outline-none transition-all text-slate-900 font-black cursor-pointer"
                                                >
                                                    <option value="1">Y1</option>
                                                    <option value="2">Y2</option>
                                                    <option value="3">Y3</option>
                                                    <option value="4">Y4</option>
                                                </select>
                                                <input
                                                    name="semester"
                                                    required
                                                    value={formData.semester}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[28px] py-5 px-6 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black text-center"
                                                    placeholder="SEM"
                                                />
                                                <input
                                                    name="section"
                                                    required
                                                    value={formData.section}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[28px] py-5 px-6 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black text-center"
                                                    placeholder="SEC"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Contact information</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                                <input
                                                    name="phone"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[32px] py-5 px-16 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                                    placeholder="+91-XXXXX-XXXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-10 pt-16 border-t border-slate-100">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-[#92400E] rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-amber-900/20">
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Skills & Domain</h3>
                                            <p className="text-[10px] font-black text-slate-400 mt-1">Your focus areas and performance</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Your domain</label>
                                            <div className="relative group">
                                                <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#92400E] transition-colors" size={20} />
                                                <input
                                                    name="domain"
                                                    required
                                                    value={formData.domain}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[32px] py-5 px-16 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                                    placeholder="e.g. Full Stack Development"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">CGPA</label>
                                            <input
                                                name="cgpa"
                                                type="number"
                                                step="0.01"
                                                value={formData.cgpa}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[32px] py-5 px-8 focus:bg-white focus:ring-[15px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-black placeholder:text-slate-300"
                                                placeholder="9.00"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 ml-4">Skills</label>
                                            <textarea
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-[40px] py-8 px-10 focus:bg-white focus:ring-[20px] focus:ring-[#92400E]/5 focus:border-[#92400E] outline-none transition-all text-slate-900 font-bold text-lg placeholder:text-slate-200"
                                                placeholder="React.js, Node.js, Python, PostgreSQL, AWS..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </section>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-black text-white font-black py-8 rounded-[40px] shadow-2xl shadow-slate-900/40 hover:shadow-slate-900/60 transition-all flex items-center justify-center space-x-6 disabled:opacity-50 group mt-10"
                                >
                                    {loading ? (
                                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Save size={32} className="group-hover:rotate-12 transition-transform duration-500 text-[#92400E]" />
                                            <span className="text-2xl tracking-tighter">Update profile</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Hash, BookOpen, Layers, Github, Linkedin, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [formData, setFormData] = useState({
        registerNumber: '',
        department: '',
        year: '1',
        domain: '',
        githubLink: '',
        linkedinLink: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/profile');
                if (data) {
                    setFormData({
                        registerNumber: data.registerNumber || '',
                        department: data.department || '',
                        year: data.year || '1',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/student/profile', formData);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Your Profile</h1>
                <p className="text-slate-400">Manage your academic and professional details</p>
            </header>

            {message && (
                <div className={`p-4 rounded-xl text-center ${message.includes('Error') ? 'bg-red-500/10 border border-red-500/50 text-red-500' : 'bg-green-500/10 border border-green-500/50 text-green-500'}`}>
                    {message}
                </div>
            )}

            <div className="glass p-8 rounded-3xl border border-white/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Register Number</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    name="registerNumber"
                                    required
                                    value={formData.registerNumber}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="e.g. 2021CSE001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Department</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Year of Study</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                            >
                                <option value="1" className="bg-secondary">1st Year</option>
                                <option value="2" className="bg-secondary">2nd Year</option>
                                <option value="3" className="bg-secondary">3rd Year</option>
                                <option value="4" className="bg-secondary">4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Domain / Specialization</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    name="domain"
                                    required
                                    value={formData.domain}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="e.g. AI & Robotics"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div className="md:col-span-2">
                            <h3 className="font-bold text-accent mb-4">Professional Links</h3>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">GitHub URL</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    name="githubLink"
                                    value={formData.githubLink}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="github.com/username"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    name="linkedinLink"
                                    value={formData.linkedinLink}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Skills (Comma separated)</label>
                        <textarea
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                            placeholder="React, Node.js, Python, Figma..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-accent/20 transition-all flex items-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            ) : (
                                <Save size={20} />
                            )}
                            <span>Save Profile Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;

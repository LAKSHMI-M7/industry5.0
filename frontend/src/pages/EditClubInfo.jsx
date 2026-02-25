import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Save,
    ArrowLeft,
    Mail,
    Instagram,
    Linkedin,
    User,
    Users,
    FileText,
    ShieldCheck,
    Contact
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditClubInfo = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        description: '',
        chairperson: '',
        secretaries: [],
        staff: [],
        email: '',
        instagram: '',
        linkedin: ''
    });
    const [secretaryString, setSecretaryString] = useState('');
    const [staffString, setStaffString] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const { data } = await axios.get('/api/club-info');
                setInfo(data);
                setSecretaryString((data.secretaries || []).join(', '));
                setStaffString((data.staff || []).join(', '));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const updateData = {
                ...info,
                secretaries: secretaryString.split(',').map(s => s.trim()).filter(s => s !== ''),
                staff: staffString.split(',').map(s => s.trim()).filter(s => s !== '')
            };
            await axios.put('/api/club-info', updateData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            window.location.reload();
        } catch (err) {
            alert('Error updating club information');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#92400E]/20 border-t-[#92400E] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 font-['Outfit']">
            <header className="flex items-center justify-between">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors mb-4 text-xs font-black uppercase tracking-widest">
                        <ArrowLeft size={14} />
                        <span>Back</span>
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Edit Club Nexus</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Configure global institutional identities</p>
                </div>
                <div className="w-16 h-16 bg-[#92400E]/10 rounded-[28px] flex items-center justify-center text-[#92400E] shadow-inner font-['Outfit']">
                    <ShieldCheck size={32} />
                </div>
            </header>

            <form onSubmit={handleSave} className="space-y-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Club Identity */}
                    <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-8 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-2">
                            <FileText className="text-[#92400E]" size={20} />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Club Architecture</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Club Description</label>
                            <textarea
                                name="description"
                                value={info.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 focus:bg-white focus:ring-4 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-medium leading-relaxed"
                                placeholder="Describe the club's mission and goals..."
                            />
                        </div>
                    </section>

                    {/* Personnel */}
                    <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-8 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-2">
                            <Users className="text-[#92400E]" size={20} />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Personnel Matrix</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1 flex items-center space-x-2">
                                    <User size={12} />
                                    <span>Chairperson</span>
                                </label>
                                <input
                                    type="text"
                                    name="chairperson"
                                    value={info.chairperson}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold uppercase tracking-tight"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Secretaries (Comma Separated)</label>
                                <input
                                    type="text"
                                    value={secretaryString}
                                    onChange={(e) => setSecretaryString(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="Name1, Name2, Name3"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Staff / Staff Coordinators (Comma Separated)</label>
                                <input
                                    type="text"
                                    value={staffString}
                                    onChange={(e) => setStaffString(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold"
                                    placeholder="Coordinator 1, Coordinator 2"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Social Nexus */}
                    <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-8 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-2">
                            <Instagram className="text-[#92400E]" size={20} />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Social Nexus</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1 flex items-center space-x-2">
                                    <Mail size={12} />
                                    <span>Official Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={info.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1 flex items-center space-x-2">
                                    <Instagram size={12} />
                                    <span>Instagram ID</span>
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={info.instagram}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1 flex items-center space-x-2">
                                    <Linkedin size={12} />
                                    <span>LinkedIn URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={info.linkedin}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-[#92400E]/5 outline-none transition-all text-slate-900 font-bold"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="flex items-center justify-end space-x-6">
                    {success && (
                        <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest animate-pulse">Changes Propagated Successfully</p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-[28px] font-black uppercase tracking-[2px] text-xs shadow-2xl flex items-center space-x-3 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{saving ? 'Syncing...' : 'Save Configuration'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClubInfo;

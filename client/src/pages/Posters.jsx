import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Image, Plus, X, Calendar, Eye, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const Posters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [previewPoster, setPreviewPoster] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const fetchPosters = async () => {
        try {
            const { data } = await axios.get('/api/posters');
            setPosters(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosters(); }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) return setMessage({ type: 'error', text: 'Please select a poster image.' });
        if (!formData.title.trim()) return setMessage({ type: 'error', text: 'Please enter a title.' });

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('image', imageFile);
            data.append('title', formData.title);
            data.append('description', formData.description);
            const { data: newPoster } = await axios.post('/api/posters', data);
            setPosters(prev => [newPoster, ...prev]);
            setMessage({ type: 'success', text: 'Poster published successfully!' });
            setShowForm(false);
            setFormData({ title: '', description: '' });
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload poster.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poster?')) return;
        try {
            await axios.delete(`/api/posters/${id}`);
            setPosters(prev => prev.filter(p => p._id !== id));
            setMessage({ type: 'success', text: 'Poster deleted.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete poster.' });
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen p-8 md:p-12 font-['Outfit']" style={{ background: '#ECECEC' }}>
            <div className="max-w-6xl mx-auto space-y-10 pb-20">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="h-[2px] w-10 bg-[#9A4A17]"></span>
                            <span className="text-[10px] font-black text-[#9A4A17] uppercase tracking-[4px]">Club Notice Board</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Posters</h1>
                        <p className="text-slate-500 text-sm font-semibold mt-1">{posters.length} poster{posters.length !== 1 ? 's' : ''} published</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-3 bg-[#9A4A17] hover:bg-[#7a3912] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-900/30"
                    >
                        <Plus size={20} />
                        <span>Upload New Poster</span>
                    </button>
                </header>

                {/* Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onAnimationComplete={() => setTimeout(() => setMessage(null), 3000)}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span>{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload Form Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                        >
                            <motion.div
                                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Poster</h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Image Upload Area */}
                                    <div
                                        className="border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden cursor-pointer hover:border-[#9A4A17] transition-colors group"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                        ) : (
                                            <div className="h-48 flex flex-col items-center justify-center text-slate-400 group-hover:text-[#9A4A17] transition-colors">
                                                <Image size={40} className="mb-2" />
                                                <p className="font-bold text-sm">Click to select poster image</p>
                                                <p className="text-xs mt-1">JPG, PNG up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                                    {/* Title */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Poster Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                            placeholder="e.g. National Level Hackathon 2025"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-900 outline-none focus:border-[#9A4A17] focus:ring-4 focus:ring-[#9A4A17]/10 transition-all"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Description (Optional)</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Brief description about this event or notice..."
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-900 outline-none focus:border-[#9A4A17] focus:ring-4 focus:ring-[#9A4A17]/10 transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#9A4A17] hover:bg-[#7a3912] text-white font-black py-4 rounded-xl transition-all flex items-center justify-center space-x-3 disabled:opacity-60"
                                    >
                                        {submitting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                                        <span>{submitting ? 'Publishing...' : 'Publish Poster'}</span>
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Posters Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                                <div className="h-52 bg-slate-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                                    <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posters.length === 0 ? (
                    <div className="text-center py-28 bg-white rounded-3xl">
                        <Image size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-wider">No Posters Yet</h3>
                        <p className="text-slate-400 text-sm mt-2">Upload your first club notice poster.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posters.map((poster, idx) => (
                            <motion.div
                                key={poster._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="relative overflow-hidden h-52">
                                    <img
                                        src={poster.imageUrl}
                                        alt={poster.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => setPreviewPoster(poster)}
                                            className="bg-white text-slate-900 p-3 rounded-xl hover:bg-[#9A4A17] hover:text-white transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(poster._id)}
                                            className="bg-white text-slate-900 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 text-lg leading-tight mb-1 line-clamp-2">{poster.title}</h3>
                                    {poster.description && (
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{poster.description}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
                                            <Calendar size={12} />
                                            <span>{formatDate(poster.createdAt)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(poster._id)}
                                            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center space-x-1"
                                        >
                                            <Trash2 size={12} />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Preview Modal */}
            <AnimatePresence>
                {previewPoster && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewPoster(null)}
                    >
                        <motion.div
                            className="relative max-w-3xl w-full"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPreviewPoster(null)}
                                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                            <img src={previewPoster.imageUrl} alt={previewPoster.title} className="w-full rounded-2xl shadow-2xl" />
                            <div className="mt-4 text-white">
                                <h3 className="text-2xl font-black">{previewPoster.title}</h3>
                                {previewPoster.description && <p className="text-white/70 mt-1">{previewPoster.description}</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Posters;

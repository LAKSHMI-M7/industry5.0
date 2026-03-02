import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Calendar, Download, Eye, X, Bell } from 'lucide-react';

const ClubNotices = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewPoster, setPreviewPoster] = useState(null);

    useEffect(() => {
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
        fetchPosters();
    }, []);

    const handleDownload = async (poster) => {
        try {
            const response = await fetch(poster.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${poster.title.replace(/\s+/g, '_')}.jpg`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            window.open(poster.imageUrl, '_blank');
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen p-8 md:p-12 font-['Outfit']" style={{ background: '#ECECEC' }}>
            <div className="max-w-6xl mx-auto space-y-10 pb-20">

                {/* Header */}
                <header>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="h-[2px] w-10 bg-[#9A4A17]"></span>
                        <span className="text-[10px] font-black text-[#9A4A17]">Industry 5.0 Club</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Club Notices</h1>
                    <p className="text-slate-500 text-sm font-semibold mt-1">
                        {loading ? 'Loading...' : `${posters.length} notice${posters.length !== 1 ? 's' : ''} posted`}
                    </p>
                </header>

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
                    <div className="text-center py-32 bg-white rounded-3xl">
                        <Bell size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-black text-slate-400">No notices yet</h3>
                        <p className="text-slate-400 text-sm mt-2">Club notices and event posters will appear here.</p>
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
                                {/* Poster Image */}
                                <div className="relative overflow-hidden h-56 cursor-pointer" onClick={() => setPreviewPoster(poster)}>
                                    <img
                                        src={poster.imageUrl}
                                        alt={poster.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2">
                                            <Eye size={16} />
                                            <span>View Full Size</span>
                                        </div>
                                    </div>
                                    {idx === 0 && (
                                        <div className="absolute top-3 left-3 bg-[#9A4A17] text-white text-[10px] font-black px-3 py-1 rounded-full">
                                            Latest
                                        </div>
                                    )}
                                </div>

                                {/* Poster Info */}
                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 text-lg leading-tight mb-1 line-clamp-2">{poster.title}</h3>
                                    {poster.description && (
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{poster.description}</p>
                                    )}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
                                            <Calendar size={12} />
                                            <span>{formatDate(poster.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setPreviewPoster(poster)}
                                                className="text-xs font-bold text-[#9A4A17] hover:text-[#7a3912] flex items-center space-x-1 transition-colors"
                                            >
                                                <Eye size={12} />
                                                <span>View</span>
                                            </button>
                                            <span className="text-slate-200">|</span>
                                            <button
                                                onClick={() => handleDownload(poster)}
                                                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-1 transition-colors"
                                            >
                                                <Download size={12} />
                                                <span>Download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Preview Lightbox */}
            <AnimatePresence>
                {previewPoster && (
                    <motion.div
                        className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewPoster(null)}
                    >
                        <motion.div
                            className="relative max-w-3xl w-full"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white">{previewPoster.title}</h3>
                                    {previewPoster.description && (
                                        <p className="text-white/60 text-sm mt-0.5">{previewPoster.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3 ml-4 shrink-0">
                                    <button
                                        onClick={() => handleDownload(previewPoster)}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all"
                                    >
                                        <Download size={16} />
                                        <span>Download</span>
                                    </button>
                                    <button
                                        onClick={() => setPreviewPoster(null)}
                                        className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <img
                                src={previewPoster.imageUrl}
                                alt={previewPoster.title}
                                className="w-full rounded-2xl shadow-2xl max-h-[75vh] object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClubNotices;

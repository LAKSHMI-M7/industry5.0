import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, CheckCircle2, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [reply, setReply] = useState('');

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/secretary/updates');
                setUpdates(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUpdates();
    }, []);

    const handleReply = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/secretary/updates/${selectedUpdate._id}/reply`, { feedback, reply });
            setUpdates(updates.map(u => u._id === selectedUpdate._id ? { ...u, secretaryFeedback: feedback, secretaryReply: reply } : u));
            setSelectedUpdate(null);
            setFeedback('');
            setReply('');
        } catch (err) {
            alert('Error sending reply');
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Review Daily Updates</h1>
                <p className="text-slate-400">Provide feedback on student daily progress</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                    {updates.map((update) => (
                        <motion.div
                            key={update._id}
                            onClick={() => setSelectedUpdate(update)}
                            className={`glass p-6 rounded-2xl border transition-all cursor-pointer ${selectedUpdate?._id === update._id ? 'border-accent shadow-lg shadow-accent/10' : 'border-white/5 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-accent">
                                        {update.user?.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold">{update.user?.name}</p>
                                        <p className="text-[10px] text-slate-500">{new Date(update.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${update.secretaryReply ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                    {update.secretaryReply ? 'Reviewed' : 'Pending'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 line-clamp-2">{update.workDone}</p>
                            <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                                <span className="flex items-center space-x-1"><Clock size={12} /> <span>{update.timeSpent}</span></span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="sticky top-8">
                    {selectedUpdate ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-3xl border border-white/5 shadow-2xl"
                        >
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">{selectedUpdate.user?.name}</h3>
                                <p className="text-sm text-slate-400">{new Date(selectedUpdate.date).toLocaleString()}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-widest">Work Done</p>
                                    <p className="text-slate-200">{selectedUpdate.workDone}</p>
                                </div>

                                {selectedUpdate.issuesFaced && (
                                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                                        <p className="text-xs text-red-500 font-bold mb-2 uppercase tracking-widest">Issues Faced</p>
                                        <p className="text-slate-300">{selectedUpdate.issuesFaced}</p>
                                    </div>
                                )}

                                <form onSubmit={handleReply} className="space-y-4 pt-4 border-t border-white/5">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Quick Feedback / Reply</label>
                                        <textarea
                                            required
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            rows="4"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                            placeholder="Type your message to the student..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Send size={18} />
                                        <span>Send Feedback</span>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass p-12 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-slate-500 space-y-4 text-center">
                            <div className="p-4 bg-white/5 rounded-full"><MessageSquare size={48} /></div>
                            <p>Select an update from the list to review and provide feedback.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewUpdates;

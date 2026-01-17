import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, AlertCircle, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [formData, setFormData] = useState({
        workDone: '',
        timeSpent: '',
        issuesFaced: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/daily-update');
                setUpdates(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUpdates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/student/daily-update', formData);
            setUpdates([data, ...updates]);
            setFormData({ workDone: '', timeSpent: '', issuesFaced: '' });
        } catch (err) {
            alert('Error submitting update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Daily Work Updates</h1>
                <p className="text-slate-400">Log your progress and challenges</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 h-fit">
                    <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                        <FileText className="text-accent" size={24} />
                        <span>Submit New Update</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">What did you work on today?</label>
                            <textarea
                                required
                                value={formData.workDone}
                                onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                placeholder="Describe your activities..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Time Spent</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        required
                                        value={formData.timeSpent}
                                        onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                        placeholder="e.g. 3 hours"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Issues Faced (Optional)</label>
                            <div className="relative">
                                <AlertCircle className="absolute left-3 top-3 text-slate-500" size={18} />
                                <textarea
                                    value={formData.issuesFaced}
                                    onChange={(e) => setFormData({ ...formData, issuesFaced: e.target.value })}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="Any blockers or problems?"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center space-x-2"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Send size={18} />}
                            <span>Submit Update</span>
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Previous Updates</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {updates.map((update, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={update._id}
                                className="glass p-6 rounded-2xl border border-white/5"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">SUBMITTED ON</p>
                                        <p className="text-sm font-bold text-accent">{new Date(update.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 font-medium tracking-wider">TIME SPENT</p>
                                        <p className="text-sm font-bold">{update.timeSpent}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-slate-300 leading-relaxed font-semibold">Activity:</p>
                                    <p className="text-sm text-slate-400 mt-1">{update.workDone}</p>
                                </div>
                                {update.issuesFaced && (
                                    <div className="mt-3 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                        <p className="text-xs text-red-500 font-bold">ISSUES:</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{update.issuesFaced}</p>
                                    </div>
                                )}
                                {update.secretaryReply && (
                                    <div className="mt-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
                                        <p className="text-xs text-accent font-bold">SECRETARY FEEDBACK:</p>
                                        <p className="text-xs text-slate-300 mt-1 italic">"{update.secretaryReply}"</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyUpdates;

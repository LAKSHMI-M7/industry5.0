import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, CheckCircle2, AlertCircle, Clock, ExternalLink, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [status, setStatus] = useState('Completed');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/secretary/reports');
                setReports(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReports();
    }, []);

    const handleReview = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/secretary/reports/${selectedReport._id}/review`, { status, feedback });
            setReports(reports.map(r => r._id === selectedReport._id ? { ...r, status, secretaryFeedback: feedback } : r));
            setSelectedReport(null);
            setFeedback('');
        } catch (err) {
            alert('Error updating report status');
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Review Weekly Reports</h1>
                <p className="text-slate-400">Evaluate and guide student progress</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                    {reports.map((report) => (
                        <motion.div
                            key={report._id}
                            onClick={() => {
                                setSelectedReport(report);
                                setStatus(report.status || 'Completed');
                                setFeedback(report.secretaryFeedback || '');
                            }}
                            className={`glass p-6 rounded-2xl border transition-all cursor-pointer ${selectedReport?._id === report._id ? 'border-accent shadow-lg shadow-accent/10' : 'border-white/5 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${report.user?.name}&background=random`}
                                        className="w-10 h-10 rounded-lg"
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-bold">{report.user?.name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono uppercase">
                                            {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${report.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                        report.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' :
                                            report.status === 'Needs Improvement' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-slate-500/10 text-slate-500'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tighter">Completed Work:</p>
                            <p className="text-sm text-slate-300 line-clamp-2">{report.completedWork}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="sticky top-8">
                    {selectedReport ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-3xl border border-white/5 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">{selectedReport.user?.name}</h3>
                                    <p className="text-xs text-slate-400">Weekly Performance Report</p>
                                </div>
                                {selectedReport.githubRepoLink && (
                                    <a href={selectedReport.githubRepoLink} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg text-accent hover:bg-accent/10 transition-all">
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Completed</p>
                                        <p className="text-sm text-slate-200">{selectedReport.completedWork}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Next Week Plan</p>
                                        <p className="text-sm text-slate-300">{selectedReport.nextWeekPlan}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleReview} className="space-y-4 pt-4 border-t border-white/5">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Set Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                        >
                                            <option value="Completed" className="bg-secondary">Completed</option>
                                            <option value="Ongoing" className="bg-secondary">Ongoing</option>
                                            <option value="Needs Improvement" className="bg-secondary">Needs Improvement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 mb-2 block">Secretary Feedback</label>
                                        <textarea
                                            required
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            rows="4"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                            placeholder="Provide detailed feedback on this week's work..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        <span>Update Report Review</span>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass p-12 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-slate-500 space-y-4 text-center h-full min-h-[400px]">
                            <div className="p-4 bg-white/5 rounded-full"><ClipboardList size={48} /></div>
                            <p>Select a weekly report to review performance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewReports;

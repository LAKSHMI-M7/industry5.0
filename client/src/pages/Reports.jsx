import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Calendar, Github, Send, CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [formData, setFormData] = useState({
        weekStartDate: '',
        weekEndDate: '',
        completedWork: '',
        ongoingWork: '',
        nextWeekPlan: '',
        githubRepoLink: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/weekly-report');
                setReports(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchReports();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/student/weekly-report', formData);
            setReports([data, ...reports]);
            setFormData({
                weekStartDate: '',
                weekEndDate: '',
                completedWork: '',
                ongoingWork: '',
                nextWeekPlan: '',
                githubRepoLink: ''
            });
        } catch (err) {
            alert('Error submitting report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Weekly Performance Reports</h1>
                <p className="text-slate-400">Summarize your achievements and future goals</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 h-fit">
                    <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                        <ClipboardList className="text-accent" size={24} />
                        <span>Submit Weekly Report</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Week Start</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.weekStartDate}
                                    onChange={(e) => setFormData({ ...formData, weekStartDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Week End</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.weekEndDate}
                                    onChange={(e) => setFormData({ ...formData, weekEndDate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Completed Work</label>
                            <textarea
                                required
                                value={formData.completedWork}
                                onChange={(e) => setFormData({ ...formData, completedWork: e.target.value })}
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                placeholder="Bullet points of what you finished..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Ongoing Tasks</label>
                                <textarea
                                    required
                                    value={formData.ongoingWork}
                                    onChange={(e) => setFormData({ ...formData, ongoingWork: e.target.value })}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="Work in progress..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Next Week Plan</label>
                                <textarea
                                    required
                                    value={formData.nextWeekPlan}
                                    onChange={(e) => setFormData({ ...formData, nextWeekPlan: e.target.value })}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-accent outline-none"
                                    placeholder="Goals for next week..."
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center space-x-2"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Send size={18} />}
                            <span>Submit Weekly Report</span>
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Report History</h3>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                        {reports.map((report, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={report._id}
                                className="glass p-6 rounded-2xl border border-white/5"
                            >
                                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Report Period</p>
                                        <p className="text-sm font-bold text-accent">
                                            {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${report.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                        report.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' :
                                            report.status === 'Needs Improvement' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {report.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold mb-1">COMPLETED:</p>
                                        <p className="text-sm text-slate-300">{report.completedWork}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold mb-1">NEXT WEEK:</p>
                                        <p className="text-sm text-slate-300">{report.nextWeekPlan}</p>
                                    </div>
                                </div>
                                {report.secretaryFeedback && (
                                    <div className="mt-4 p-4 bg-accent/5 rounded-xl border border-accent/10 border-dashed">
                                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">Secretary Feedback</p>
                                        <p className="text-sm text-slate-300 italic">"{report.secretaryFeedback}"</p>
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

export default Reports;

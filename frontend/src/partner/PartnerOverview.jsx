import React, { useEffect, useState } from 'react';
import PartnerLayout from './PartnerLayout';
import { useAuth } from '../context/AuthContext';
import { Loader2, Briefcase, CheckCircle, Clock, IndianRupee } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900">{value}</h3>
        </div>
    </div>
);

const PartnerOverview = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/partner/jobs', {
            headers: { Authorization: `Bearer ${user?.token}` }
        })
            .then(res => res.json())
            .then(data => { setJobs(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <PartnerLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </PartnerLayout>
        );
    }

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const activeJobs = jobs.filter(j => j.status !== 'completed').length;

    // Calculate total earned from completed jobs
    const totalEarned = jobs
        .filter(j => j.status === 'completed')
        .reduce((sum, job) => sum + (job.totalAmount || 0), 0);

    return (
        <PartnerLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">Welcome back, {user?.name}! 👋</h1>
                <p className="text-gray-500 mt-2">Here is an overview of your work and earnings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Assigned"
                    value={totalJobs}
                    icon={<Briefcase className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Active Jobs"
                    value={activeJobs}
                    icon={<Clock className="w-6 h-6 text-orange-600" />}
                    color="bg-orange-50"
                />
                <StatCard
                    title="Completed"
                    value={completedJobs}
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    color="bg-green-50"
                />
                <StatCard
                    title="Total Earned"
                    value={`₹${totalEarned}`}
                    icon={<IndianRupee className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-50"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" /> Recent Activity
                </h2>
                {jobs.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No recent activity yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.slice(0, 5).map(job => (
                            <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2.5 h-2.5 rounded-full ${job.status === 'completed' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : job.status === 'in-progress' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`}></div>
                                    <div>
                                        <p className="font-bold text-gray-900">{job.service?.title}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(job.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} • {job.timeSlot}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-gray-900 block">₹{job.totalAmount}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{job.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PartnerLayout>
    );
};

export default PartnerOverview;

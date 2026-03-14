import React, { useEffect, useState } from 'react';
import PartnerLayout from './PartnerLayout';
import { useAuth } from '../context/AuthContext';
import {
    Loader2, MapPin, Phone, Mail, Clock, CalendarDays, CheckCircle2,
    PlayCircle, CheckCircle, Briefcase, KeyRound, AlertCircle, Camera, UploadCloud
} from 'lucide-react';

const STATUS_STYLES = {
    'in-progress': 'bg-purple-50 text-purple-700 border-purple-200',
    'completed': 'bg-green-50 text-green-700 border-green-200',
    'confirmed': 'bg-blue-50 text-blue-700 border-blue-200'
};

const OtpAndImageModal = ({ isOpen, type, onClose, onSubmit, loading, error, token }) => {
    const [otp, setOtp] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setOtp('');
            setImageFile(null);
            setImagePreview(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitClick = async () => {
        if (!imageFile) return; // Prevent submission without image

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const uploadRes = await fetch('http://localhost:5000/api/upload/cloudinary', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.url;

            onSubmit(otp, imageUrl); // Pass both OTP and ImageURL to the parent function
        } catch (err) {
            console.error("Image upload failed", err);
            // Parent's error state handles the display
            onSubmit(otp, null, 'Image upload failed. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center max-h-[90vh] overflow-y-auto">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-7 h-7 text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {type === 'in-progress' ? 'Start Job Details' : 'Complete Job Evidence'}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    {type === 'in-progress'
                        ? '1. Upload a "Before" photo of the work area.\n2. Enter the 4-digit Start PIN.'
                        : '1. Upload an "After" photo of the completed work.\n2. Enter the 4-digit End PIN.'}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm flex items-center gap-2 justify-center font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" /> <span className="text-left">{error}</span>
                    </div>
                )}

                {/* Image Upload Section */}
                <div className="mb-6">
                    <label className="block w-full cursor-pointer group">
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                        {imagePreview ? (
                            <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden border-2 border-primary">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-semibold flex items-center gap-2"><Camera className="w-4 h-4" /> Retake Photo</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-500 group-hover:bg-primary/5 group-hover:border-primary/50 transition">
                                <UploadCloud className="w-8 h-8 mb-2 text-gray-400 group-hover:text-primary transition" />
                                <span className="font-semibold text-sm">Tap to Take Photo</span>
                                <span className="text-xs text-gray-400 mt-1">Required</span>
                            </div>
                        )}
                    </label>
                </div>

                <div className="mb-2 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{type === 'in-progress' ? 'Start' : 'End'} PIN Code</label>
                </div>
                <input
                    type="password"
                    maxLength="4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="w-full text-center tracking-[1em] text-2xl font-bold px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 mb-6"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading || uploadingImage}
                        className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitClick}
                        disabled={loading || uploadingImage || otp.length !== 4 || !imageFile}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {(loading || uploadingImage) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {uploadingImage ? 'Uploading...' : 'Verify'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const JobCard = ({ job, onRequestStatusUpdate }) => {
    const formattedDate = new Date(job.date).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    });

    const isDoing = job.status === 'in-progress';
    const isDone = job.status === 'completed';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 flex flex-col md:flex-row">
            {/* Service & Customer Details (Left Side) */}
            <div className="flex-1 p-6 md:border-r border-gray-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {job.service?.image && (
                            <img src={job.service.image} alt={job.service.title} className="w-16 h-16 rounded-xl object-cover" />
                        )}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight">{job.service?.title}</h3>
                            <p className="text-gray-500 font-medium mt-1">₹{job.totalAmount} • {job.service?.duration || '1 hr'}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wide ${STATUS_STYLES[job.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {job.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                        <p className="font-semibold text-gray-900">{job.customerName || job.user?.name}</p>
                        <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1"><Phone className="w-3.5 h-3.5" /> {job.customerPhone || job.user?.phone || 'No phone'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Address</p>
                        <div className="flex items-start gap-1.5 text-sm text-gray-700 font-medium">
                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>
                                {job.address?.addressLine1}{job.address?.addressLine2 ? `, ${job.address.addressLine2}` : ''},<br />
                                {job.address?.city} – {job.address?.pincode}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule & Actions (Right Side) */}
            <div className="w-full md:w-72 bg-gray-50 flex flex-col">
                <div className="p-6 flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Schedule</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CalendarDays className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                                <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Time</p>
                                <p className="text-sm font-semibold text-gray-900">{job.timeSlot}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    {!isDone ? (
                        !isDoing ? (
                            <button
                                onClick={() => onRequestStatusUpdate(job._id, 'in-progress')}
                                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
                            >
                                <PlayCircle className="w-5 h-5" /> Start Job
                            </button>
                        ) : (
                            <button
                                onClick={() => onRequestStatusUpdate(job._id, 'completed')}
                                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-green-500/20"
                            >
                                <CheckCircle className="w-5 h-5" /> Mark Completed
                            </button>
                        )
                    ) : (
                        <div className="w-full py-3.5 bg-gray-200 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                            <CheckCircle2 className="w-5 h-5" /> Job Finished
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PartnerDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // OTP Modal State
    const [otpModal, setOtpModal] = useState({ isOpen: false, jobId: null, type: null, error: '', loading: false });

    useEffect(() => {
        fetch('http://localhost:5000/api/partner/jobs', {
            headers: { Authorization: `Bearer ${user?.token}` }
        })
            .then(res => res.json())
            .then(data => { setJobs(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [user]);

    const initiateStatusUpdate = (jobId, newStatus) => {
        setOtpModal({ isOpen: true, jobId, type: newStatus, error: '', loading: false });
    };

    const handleOtpVerify = async (otp, imageUrl, directErrorStr = null) => {
        if (directErrorStr) {
            setOtpModal(prev => ({ ...prev, loading: false, error: directErrorStr }));
            return;
        }

        setOtpModal(prev => ({ ...prev, loading: true, error: '' }));
        const { jobId, type } = otpModal;

        const bodyData = {
            status: type,
            otp,
            ...(type === 'in-progress' ? { beforeImage: imageUrl } : { afterImage: imageUrl })
        };

        try {
            const res = await fetch(`http://localhost:5000/api/partner/jobs/${jobId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                const updated = await res.json();
                setJobs(prev => prev.map(job => job._id === jobId ? { ...job, status: updated.status } : job));
                setOtpModal({ isOpen: false, jobId: null, type: null, error: '', loading: false });
            } else {
                const data = await res.json();
                setOtpModal(prev => ({ ...prev, loading: false, error: data.message || 'Verification Failed' }));
            }
        } catch (err) {
            setOtpModal(prev => ({ ...prev, loading: false, error: 'Connection error' }));
        }
    };

    const activeJobs = jobs.filter(j => j.status !== 'completed');
    const pastJobs = jobs.filter(j => j.status === 'completed');

    return (
        <PartnerLayout>
            <OtpAndImageModal
                isOpen={otpModal.isOpen}
                type={otpModal.type}
                onClose={() => setOtpModal({ ...otpModal, isOpen: false })}
                onSubmit={handleOtpVerify}
                loading={otpModal.loading}
                error={otpModal.error}
                token={user?.token}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">My Assigned Jobs</h1>
                <p className="text-gray-500 mt-1">View and manage your tasks. Start working on confirmed jobs.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Jobs Found</h3>
                    <p className="text-gray-500">You don't have any assigned jobs yet.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Active Jobs */}
                    {activeJobs.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Active Jobs
                            </h2>
                            {activeJobs.map(job => (
                                <JobCard key={job._id} job={job} onRequestStatusUpdate={initiateStatusUpdate} />
                            ))}
                        </div>
                    )}

                    {/* Past Jobs */}
                    {pastJobs.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed History
                            </h2>
                            {pastJobs.map(job => (
                                <JobCard key={job._id} job={job} onRequestStatusUpdate={initiateStatusUpdate} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </PartnerLayout>
    );
};

export default PartnerDashboard;

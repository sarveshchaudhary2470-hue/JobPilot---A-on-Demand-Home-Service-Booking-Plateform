import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, Mail, Phone, MapPin, CheckCircle, Loader2, FileText, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnerRegister = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '',
        addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
        aadharNumber: '', panNumber: '',
        servicesOffered: ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const nextStep = () => {
        if (step === 1 && (!form.name || !form.email || !form.phone || !form.password)) {
            setError('Please fill all basic details');
            return;
        }
        if (step === 2 && (!form.addressLine1 || !form.city || !form.state || !form.pincode)) {
            setError('Please fill all required location details');
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.aadharNumber || !form.panNumber || !form.servicesOffered) {
            setError('Please fill all document details');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            const payload = {
                ...form,
                servicesOffered: form.servicesOffered.split(',').map(s => s.trim()).filter(Boolean)
            };

            const res = await fetch('http://localhost:5000/api/partner/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to submit application. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for applying to join JobPilot. Our team will verify your details and get in touch with you shortly. If approved, you can login using the email and password you just provided.
                    </p>
                    <Link to="/" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition">
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8 gap-3">
            {[1, 2, 3].map(num => (
                <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {num}
                    </div>
                    {num < 3 && <div className={`w-10 h-1 mx-2 rounded-full ${step > num ? 'bg-primary' : 'bg-gray-100'}`} />}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">

            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Join <span className="text-primary">JobPilot</span> as a Partner</h1>
                <p className="mt-4 text-lg text-gray-600">Grow your business and earn more by joining our network of professionals.</p>
            </div>

            <div className="max-w-xl w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <StepIndicator />

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <form>
                        <AnimatePresence mode="wait">
                            {/* STEP 1: Basic Info */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Basic Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                                            <input type="text" name="name" value={form.name} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="John Doe" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                                                <input type="email" name="email" value={form.email} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="john@example.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="9876543210" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Create Password (for login later)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                            <input type="password" name="password" value={form.password} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="••••••••" />
                                        </div>
                                    </div>

                                    <button type="button" onClick={nextStep} className="mt-6 w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: Location */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Location Details</h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 (House No, Flat, Building) *</label>
                                            <input type="text" name="addressLine1" value={form.addressLine1} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="House No / Flat / Building Name" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Street, Area, Landmark)</label>
                                            <input type="text" name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="Street, Area, Village, Landmark" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                            <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="City / District" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                            <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="State" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                            <input type="text" name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="e.g. 110001" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button type="button" onClick={prevStep} className="w-1/3 py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition">Back</button>
                                        <button type="button" onClick={nextStep} className="w-2/3 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 transition">
                                            Continue <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Professional Info */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Identity & Skills</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FileText className="h-5 w-5 text-gray-400" /></div>
                                                <input type="text" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="12-digit number" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FileText className="h-5 w-5 text-gray-400" /></div>
                                                <input type="text" name="panNumber" value={form.panNumber} onChange={handleChange} className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none" placeholder="ABCDE1234F" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Services You Can Provide</label>
                                        <textarea name="servicesOffered" value={form.servicesOffered} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none resize-none" placeholder="e.g. AC Repair, Plumbing, House Cleaning (comma separated)"></textarea>
                                        <p className="text-xs text-gray-500 mt-1">List the skills you have experience in.</p>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button type="button" onClick={prevStep} disabled={submitting} className="w-1/3 py-3.5 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50">Back</button>
                                        <button type="button" onClick={handleSubmit} disabled={submitting} className="w-2/3 flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-70">
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                            {submitting ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PartnerRegister;

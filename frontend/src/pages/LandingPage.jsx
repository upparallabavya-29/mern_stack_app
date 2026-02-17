import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-sm border-b border-gray-100">
                <div className="text-xl font-bold text-gray-900">AI Mock Interview</div>
                <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-1 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 transition">
                        <Heart className="w-4 h-4 text-pink-500 fill-current" />
                        <span>Sponsor</span>
                    </button>
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer">Features</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer">Testimonials</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer">Contact</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-6 text-center relative overflow-hidden">
                {/* Subtle gradient overlay/glow effect could be added here */}
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                        Ace Your Next Interview
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Practice with AI-powered mock interviews and get personalized feedback to improve your confidence and skills.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/dashboard" className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-0.5">
                            Get Started
                        </Link>
                        <button className="bg-transparent border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Features</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our AI Mock Interview platform offers a range of powerful features to help you prepare effectively.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-md transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Mock Interviews</h3>
                            <p className="text-gray-600">
                                Simulate real interview scenarios with our advanced AI, tailored to your specific role and experience level.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-md transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Feedback</h3>
                            <p className="text-gray-600">
                                Get immediate, detailed feedback on your answers, including scores and suggestions for improvement.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-md transition">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Reports</h3>
                            <p className="text-gray-600">
                                Track your progress over time with detailed performance reports and historical data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

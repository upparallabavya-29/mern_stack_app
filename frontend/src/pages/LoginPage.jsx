import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    let username = formData.email.split('@')[0];
    // Simple mock formatting: capitalize first letter
    username = username.charAt(0).toUpperCase() + username.slice(1);
    
    // Navigate with state
    navigate('/dashboard', { state: { userName: username } });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">Sign in to continue your interview prep</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer transition-colors">
              <input type="checkbox" className="mr-2 rounded border-white/20 bg-white/5 accent-indigo-500" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center group"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative px-4 backdrop-blur-xl bg-slate-950/50 text-sm text-slate-400">
              Or continue with
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all duration-300">
              <Chrome className="h-5 w-5 mr-2" />
              Google
            </button>
            <button className="flex items-center justify-center py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all duration-300">
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

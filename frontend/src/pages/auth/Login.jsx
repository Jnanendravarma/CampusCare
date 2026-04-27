import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiShield, FiZap, FiCheckCircle } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import authService from '../../services/auth.service';
import { useToast } from '../../components/ui/Toast';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    // Navigate after state has updated to avoid race condition
    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo, { replace: true });
        }
    }, [redirectTo, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData.email, formData.password);
            onLogin(response.user);
            addToast('Login successful!', 'success');
            setRedirectTo(`/${response.user.role}/dashboard`);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            {/* Left Panel - Branding */}
            <motion.div
                className="auth-brand-panel auth-bg-animated flex items-center justify-center relative"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Floating Particles */}
                <div className="particle" style={{ width: '100px', height: '100px', top: '10%', left: '10%', animationDelay: '0s' }}></div>
                <div className="particle" style={{ width: '150px', height: '150px', top: '60%', left: '70%', animationDelay: '2s' }}></div>
                <div className="particle" style={{ width: '80px', height: '80px', top: '40%', left: '80%', animationDelay: '4s' }}></div>
                <div className="particle" style={{ width: '120px', height: '120px', top: '70%', left: '15%', animationDelay: '6s' }}></div>

                <div className="relative z-10 px-8 lg:px-12 max-w-lg">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link to="/" className="inline-flex items-center gap-3 mb-6">
                            <motion.div
                                className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-2xl logo-glow"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-[#E9D5FF] font-bold text-3xl">C</span>
                            </motion.div>
                            <span className="text-4xl font-bold gradient-text font-accent">CampusCare</span>
                        </Link>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#E9D5FF] mb-4 leading-tight">
                            Welcome Back to CampusCare
                        </h1>
                        <p className="text-xl text-[#C4B5FD] mb-8">
                            Manage campus complaints efficiently and keep your community thriving.
                        </p>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        className="space-y-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {[
                            { icon: FiZap, text: 'Lightning-fast complaint resolution' },
                            { icon: FiShield, text: 'Secure and reliable platform' },
                            { icon: FiCheckCircle, text: 'Real-time status tracking' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-3"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="feature-icon">
                                        <feature.icon className="text-[#E9D5FF] text-xl" />
                                </div>
                                <span className="text-[#C4B5FD] text-lg">{feature.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <motion.div
                className="auth-form-panel"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                        <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/15 border border-red-400/40 rounded-xl text-red-200 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email Address"
                                type="email"
                                icon={<FiMail />}
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                icon={<FiLock />}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.remember}
                                        onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                        className="w-4 h-4 text-purple-400 border-purple-400/40 bg-transparent rounded focus:ring-purple-500 transition-all"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" size="lg" gradient glow loading={loading}>
                                Sign In
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-r from-[#0F0120] via-[#17002B] to-[#0F0120] text-[#A78BFA] font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <motion.button
                            type="button"
                            onClick={async () => {
                                const { createClient } = await import('@supabase/supabase-js');
                                const supabase = createClient(
                                    import.meta.env.VITE_SUPABASE_URL,
                                    import.meta.env.VITE_SUPABASE_ANON_KEY
                                );
                                await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/auth/callback`
                                    }
                                });
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/8 border-2 border-purple-500/30 rounded-xl hover:border-purple-400/50 hover:bg-white/15 transition-all duration-300 font-medium text-[#E9D5FF] shadow-sm hover:shadow-[0_0_22px_rgba(147,51,234,0.35)] scale-on-hover"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </motion.button>

                        <p className="text-center text-sm text-gray-600 mt-8">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-purple-300 hover:text-purple-200 transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

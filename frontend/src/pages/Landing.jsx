import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiUsers, FiBarChart2, FiBell, FiShield, FiZap } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/layout/Footer';
 import { staggerContainer, staggerItem, fadeInUp, float, iconRotate, motionTimings } from '../utils/animations';

const Landing = () => {
    const features = [
        {
            icon: FiCheckCircle,
            title: 'Easy Complaint Submission',
            description: 'Submit maintenance requests in seconds with our intuitive interface.',
            gradient: 'from-purple-600 to-violet-500',
        },
        {
            icon: FiClock,
            title: 'Real-time Tracking',
            description: 'Track your complaints from submission to resolution with live updates.',
            gradient: 'from-violet-600 to-purple-500',
        },

        {
            icon: FiBarChart2,
            title: 'Analytics Dashboard',
            description: 'Get insights into maintenance trends and staff performance.',
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            icon: FiBell,
            title: 'Instant Notifications',
            description: 'Stay informed with real-time notifications on complaint status.',
            gradient: 'from-purple-500 to-violet-600',
        },
        {
            icon: FiShield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security to protect your data and privacy.',
            gradient: 'from-violet-600 to-purple-600',
        },
    ];

    const steps = [
        { number: '01', title: 'Submit Complaint', description: 'Describe your issue with details and priority', icon: FiCheckCircle },
        { number: '02', title: 'Get Assigned', description: 'Staff member is automatically assigned to your request', icon: FiUsers },
        { number: '03', title: 'Track Progress', description: 'Monitor resolution status in real-time', icon: FiZap },
    ];



    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B0014] via-[#140021] to-[#1F0033]"></div>
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(at 20% 20%, rgba(147,51,234,0.35) 0px, transparent 45%),
                                     radial-gradient(at 80% 25%, rgba(168,85,247,0.28) 0px, transparent 48%),
                                     radial-gradient(at 40% 80%, rgba(124,58,237,0.26) 0px, transparent 45%)`
                }}></div>
            </div>

            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: motionTimings.slow }}
                className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center gap-2"
                        >
                            {/* Logo Icon */}
                            <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.55)]">
                                <span className="text-[#E9D5FF] font-bold text-xl">C</span>
                            </div>
                            {/* Title - visible on desktop */}
                            <span className="hidden sm:block font-accent text-xl font-bold tracking-wide gradient-text drop-shadow-[0_0_14px_rgba(168,85,247,0.65)]">
                                CampusCare
                            </span>
                        </motion.div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="sm:size-md">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button gradient glow size="sm" className="sm:size-md">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Floating Elements */}
                <motion.div
                    variants={float}
                    animate="animate"
                    transition={{ duration: motionTimings.float }}
                    className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-violet-400 rounded-full opacity-30 blur-2xl"
                />
                <motion.div
                    variants={float}
                    animate="animate"
                    transition={{ delay: motionTimings.slow, duration: motionTimings.float }}
                    className="absolute bottom-20 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-violet-600 to-purple-400 rounded-full opacity-30 blur-2xl"
                />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="text-center max-w-5xl mx-auto"
                    >


                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#E9D5FF] mb-4 sm:mb-6 leading-tight">
                            Smart Maintenance
                            <span className="block mt-2">
                                <span className="gradient-text">Made Simple</span>
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-[#C4B5FD] mb-8 sm:mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
                            Streamline complaint management for your campus, apartment, or organization with our intelligent platform powered by modern technology.
                        </p>




                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E9D5FF] mb-4">How It Works</h2>
                        <p className="text-lg sm:text-xl text-[#C4B5FD] max-w-2xl mx-auto">
                            Three simple steps to efficient maintenance management
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={staggerItem}
                                    className="relative"
                                >
                                    <Card effect3d className="p-6 sm:p-8 h-full border border-purple-500/25">
                                        <motion.div
                                            className="w-14 h-14 sm:w-16 sm:h-16 gradient-bg-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
                                            variants={iconRotate}
                                            initial="rest"
                                            whileHover="hover"
                                        >
                                            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                        </motion.div>
                                        <div className="text-5xl sm:text-6xl font-bold text-primary-500/10 mb-3 sm:mb-4">{step.number}</div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-[#E9D5FF] mb-2 sm:mb-3">{step.title}</h3>
                                        <p className="text-[#C4B5FD] leading-relaxed">{step.description}</p>
                                    </Card>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-400 to-primary-200" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#E9D5FF] mb-4">Powerful Features</h2>
                        <p className="text-lg sm:text-xl text-[#C4B5FD] max-w-2xl mx-auto">
                            Everything you need to manage maintenance efficiently
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={staggerItem}
                                >
                                    <Card effect3d glow className="p-6 sm:p-8 h-full border border-purple-500/25">
                                        <motion.div
                                            className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: motionTimings.entry }}
                                        >
                                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </motion.div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-[#E9D5FF] mb-2 sm:mb-3">{feature.title}</h3>
                                        <p className="text-[#C4B5FD] leading-relaxed">{feature.description}</p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED]"></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="glass-dark rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-xl border border-white/20">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to Get Started?</h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Join hundreds of organizations already using CampusCare to streamline their maintenance operations
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white/90 text-[#3b0764] hover:bg-white">
                                    Start Your Free Trial
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;

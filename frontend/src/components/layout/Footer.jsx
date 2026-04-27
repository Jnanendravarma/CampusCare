import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import Dock from '../ui/Dock';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialItems = [
        { 
            icon: <FiGithub size={18} />, 
            label: 'GitHub', 
            onClick: () => window.open('https://github.com', '_blank') 
        },
        { 
            icon: <FiTwitter size={18} />, 
            label: 'Twitter', 
            onClick: () => window.open('https://twitter.com', '_blank') 
        },
        { 
            icon: <FiLinkedin size={18} />, 
            label: 'LinkedIn', 
            onClick: () => window.open('https://linkedin.com', '_blank') 
        },
        { 
            icon: <FiMail size={18} />, 
            label: 'Email', 
            onClick: () => window.location.href = 'mailto:contact@campuscare.com' 
        }
    ];

    return (
        <footer className="bg-white/5 backdrop-blur-md border-t border-purple-500/20 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(147,51,234,0.5)]">
                                <span className="text-[#E9D5FF] font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-bold gradient-text">CampusCare</span>
                        </div>
                        <p className="text-[#A78BFA] text-sm max-w-md">
                            Smart Maintenance & Complaint Management System for modern campuses, apartments, and organizations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-[#E9D5FF] mb-3">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-[#A78BFA] hover:text-[#E9D5FF] text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/features" className="text-[#A78BFA] hover:text-[#E9D5FF] text-sm transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-[#A78BFA] hover:text-[#E9D5FF] text-sm transition-colors">Pricing</Link></li>
                            <li><Link to="/contact" className="text-[#A78BFA] hover:text-[#E9D5FF] text-sm transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-[#E9D5FF] mb-3">Connect</h3>
                        <Dock 
                            items={socialItems} 
                            panelHeight={50}
                            baseItemSize={40}
                            magnification={60}
                            distance={150}
                        />
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-purple-500/20 text-center text-sm text-[#A78BFA]">
                    <p>&copy; {currentYear} CampusCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

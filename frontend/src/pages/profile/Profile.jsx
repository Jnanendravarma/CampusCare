import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit2, FiSave, FiX, FiShield, FiCalendar } from 'react-icons/fi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import userService from '../../services/user.service';

const Profile = ({ onProfileUpdate }) => {
    const { addToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setFormData({ name: data.name, email: data.email });
        } catch (err) {
            addToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            addToast('Name cannot be empty', 'error');
            return;
        }
        setSaving(true);
        try {
            const updated = await userService.updateProfile({ name: formData.name });
            setProfile(updated);
            setFormData({ name: updated.name, email: updated.email });
            setEditing(false);
            addToast('Profile updated successfully!', 'success');
            if (onProfileUpdate) onProfileUpdate(updated);
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: profile.name, email: profile.email });
        setEditing(false);
    };

    const getAvatarBg = (role) => {
        const colors = {
            student: 'from-purple-600 to-violet-500',
            staff: 'from-violet-600 to-purple-500',
            admin: 'from-purple-700 to-violet-600',
        };
        return colors[role] || 'from-purple-600 to-violet-500';
    };

    const getRoleBadge = (role) => {
        const styles = {
            student: 'bg-purple-500/20 text-purple-200 border border-purple-400/40',
            staff: 'bg-violet-500/20 text-violet-200 border border-violet-400/40',
            admin: 'bg-purple-600/25 text-purple-100 border border-purple-300/40',
        };
        return styles[role] || 'bg-white/10 text-[#C4B5FD] border border-purple-500/30';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 shadow-soft animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white/10" />
                            <div className="space-y-2 flex-1">
                                <div className="h-5 bg-white/10 rounded w-1/3" />
                                <div className="h-4 bg-white/5 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!profile) return null;

    const initials = profile.name
        ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your personal information</p>
            </motion.div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl shadow-soft overflow-hidden"
            >
                {/* Banner */}
                <div className={`h-28 bg-gradient-to-r ${getAvatarBg(profile.role)}`} />

                {/* Avatar + Info */}
                <div className="px-6 pb-6">
                    <div className="flex items-end justify-between -mt-12 mb-4">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarBg(profile.role)} flex items-center justify-center text-[#E9D5FF] text-3xl font-bold shadow-lg border-4 border-[#2A1044]`}>
                                {initials}
                            </div>
                        </div>
                        {!editing ? (
                            <Button
                                onClick={() => setEditing(true)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <FiEdit2 className="w-4 h-4" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <FiX className="w-4 h-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    loading={saving}
                                    className="flex items-center gap-2"
                                >
                                    <FiSave className="w-4 h-4" />
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>

                    {!editing ? (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-500 mt-0.5">{profile.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleBadge(profile.role)}`}>
                                {profile.role}
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-2">
                            <Input
                                label="Full Name"
                                icon={<FiUser />}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your full name"
                            />
                            <Input
                                label="Email Address"
                                icon={<FiMail />}
                                value={formData.email}
                                disabled
                                placeholder="Email (cannot be changed)"
                                className="opacity-60 cursor-not-allowed"
                            />
                            <p className="text-xs text-[#A78BFA]">
                                * Email cannot be changed for security reasons.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Account Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl shadow-soft p-6"
            >
                <h3 className="text-lg font-semibold text-[#E9D5FF] mb-4">Account Details</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 py-3 border-b border-purple-500/20">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center border border-purple-400/30">
                            <FiShield className="w-4 h-4 text-purple-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
                            <p className="text-sm font-medium text-gray-800 capitalize">{profile.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-b border-purple-500/20">
                        <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center border border-violet-400/30">
                            <FiMail className="w-4 h-4 text-violet-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-800">{profile.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center border border-purple-400/30">
                            <FiCalendar className="w-4 h-4 text-purple-300" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Member Since</p>
                            <p className="text-sm font-medium text-gray-800">{formatDate(profile.created_at)}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;

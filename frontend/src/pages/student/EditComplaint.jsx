import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { categories, priorities } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import complaintService from '../../services/complaint.service';

const EditComplaint = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        priority: 'medium',
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch complaint data on mount
    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const complaint = await complaintService.getComplaint(id);

                // Check if complaint can be edited (only pending status)
                if (complaint.status !== 'pending') {
                    addToast('You can only edit pending complaints', 'error');
                    navigate('/student/dashboard');
                    return;
                }

                setFormData({
                    title: complaint.title,
                    category: complaint.category,
                    description: complaint.description,
                    priority: complaint.priority,
                });
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to load complaint';
                addToast(errorMessage, 'error');
                navigate('/student/dashboard');
            } finally {
                setFetchingData(false);
            }
        };

        fetchComplaint();
    }, [id, navigate, addToast]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await complaintService.updateComplaint(id, formData);
            addToast('Complaint updated successfully!', 'success');
            navigate('/student/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update complaint. Please try again.';
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-400/30 border-t-primary-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Complaint</h1>
                    <p className="text-gray-600 mt-1">Update your maintenance request details</p>
                </div>

                {/* Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl shadow-soft p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Complaint Title"
                            placeholder="Brief description of the issue"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <Select
                            label="Category"
                            options={categories}
                            placeholder="Select a category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Provide detailed information about the issue..."
                            rows={6}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        <Select
                            label="Priority Level"
                            options={priorities}
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        />

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Image (Optional)
                            </label>

                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-purple-500/40 rounded-lg cursor-pointer hover:border-purple-400 transition-all bg-white/5 hover:bg-purple-500/10 hover:shadow-[0_0_24px_rgba(147,51,234,0.35)]">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FiUpload className="w-10 h-10 text-purple-300 mb-3" />
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-2 right-2 p-2 bg-error text-white rounded-full hover:bg-error-dark transition-colors shadow-[0_0_16px_rgba(239,68,68,0.4)]"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="flex-1"
                                gradient
                                glow
                                loading={loading}
                            >
                                Update Complaint
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/student/dashboard')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditComplaint;

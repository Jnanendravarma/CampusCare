import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import CursorRipple from './components/ui/CursorRipple';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import authService from './services/auth.service';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GoogleCallback from './pages/auth/GoogleCallback';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import RaiseComplaint from './pages/student/RaiseComplaint';
import EditComplaint from './pages/student/EditComplaint';
import ComplaintDetail from './pages/student/ComplaintDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Staff Pages
import StaffDashboard from './pages/staff/Dashboard';

// Shared Pages
import Profile from './pages/profile/Profile';

// Layout wrapper for authenticated pages
const DashboardLayout = ({ user, onLogout, children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                user={user}
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
                onLogout={onLogout}
            />
            <div className="flex flex-1">
                <Sidebar
                    role={user.role}
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount (no backend call needed)
    useEffect(() => {
        const storedUser = authService.getStoredUser();
        const isAuthenticated = authService.isAuthenticated();

        if (isAuthenticated && storedUser) {
            // Trust the stored session; the backend will reject individual
            // API calls if the token has truly expired.
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    // Helper: redirect logged-in users away from auth pages
    const redirectIfLoggedIn = (element) => {
        if (user) {
            return <Navigate to={`/${user.role}/dashboard`} replace />;
        }
        return element;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-400/30 border-t-primary-500 shadow-glow"></div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <CursorRipple />
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={redirectIfLoggedIn(<Login onLogin={handleLogin} />)} />
                    <Route path="/register" element={redirectIfLoggedIn(<Register onLogin={handleLogin} />)} />
                    <Route path="/auth/callback" element={<GoogleCallback onLogin={handleLogin} />} />

                    {/* Student Routes */}
                    <Route
                        path="/student/dashboard"
                        element={
                            user && user.role === 'student' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <StudentDashboard user={user} />
                                </DashboardLayout>
                            ) : user ? (
                                <Navigate to={`/${user.role}/dashboard`} replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="/student/raise-complaint"
                        element={
                            user && user.role === 'student' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <RaiseComplaint />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/student/complaints/:id/edit"
                        element={
                            user && user.role === 'student' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <EditComplaint />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/student/complaints/:id"
                        element={
                            user && user.role === 'student' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <ComplaintDetail />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            user && user.role === 'admin' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <AdminDashboard />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/admin/complaints/:id"
                        element={
                            user && user.role === 'admin' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <ComplaintDetail />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Staff Routes */}
                    <Route
                        path="/staff/dashboard"
                        element={
                            user && user.role === 'staff' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <StaffDashboard user={user} />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/staff/tasks/:id"
                        element={
                            user && user.role === 'staff' ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <ComplaintDetail />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Profile Route - All roles */}
                    <Route
                        path="/profile"
                        element={
                            user ? (
                                <DashboardLayout user={user} onLogout={handleLogout}>
                                    <Profile user={user} onProfileUpdate={(updated) => setUser({...user, ...updated})} />
                                </DashboardLayout>
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;

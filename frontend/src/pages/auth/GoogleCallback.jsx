import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '../../components/ui/Toast';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const GoogleCallback = ({ onLogin }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase puts the session in the URL hash — getSession() reads it automatically
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    addToast('Google authentication failed. Please try again.', 'error');
                    navigate('/login');
                    return;
                }

                const token = session.access_token;
                const supabaseUser = session.user;
                const name = supabaseUser.user_metadata?.full_name
                    || supabaseUser.user_metadata?.name
                    || supabaseUser.email.split('@')[0];

                // Always call /google-profile — it does an upsert so it's safe
                // for both new users (creates row) and returning users (returns existing row)
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        email: supabaseUser.email,
                        avatar: supabaseUser.user_metadata?.avatar_url || null
                    })
                });

                const data = await res.json();

                if (!res.ok || !data.user) {
                    addToast(data.message || 'Failed to load user profile.', 'error');
                    navigate('/login');
                    return;
                }

                const user = data.user;

                // Store session and update app state
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                onLogin(user);
                addToast('Successfully signed in with Google!', 'success');
                navigate(`/${user.role}/dashboard`, { replace: true });

            } catch (error) {
                console.error('OAuth callback error:', error);
                addToast('Failed to complete authentication. Please try again.', 'error');
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, onLogin, addToast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0014] via-[#140021] to-[#1F0033]">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-400 mb-4"></div>
                <h2 className="text-2xl font-bold text-[#E9D5FF] mb-2">Completing Sign In...</h2>
                <p className="text-[#C4B5FD]">Please wait while we set up your account</p>
            </div>
        </div>
    );
};

export default GoogleCallback;

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';

export default function UserDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be logged in to access this page.');
                router.push('/login');
            } else {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    setError('Could not fetch user data.');
                    router.push('/login');
                } else {
                    setEmail(user.email ?? '');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">User Dashboard</h1>
                <p className="text-center">Welcome to your dashboard!</p>
            </div>
        </div>
    );
}
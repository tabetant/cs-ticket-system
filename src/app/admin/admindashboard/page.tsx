'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';
export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        supabase().auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError('You must be logged in to access this page.');
            } else {
                const user = await supabase.auth.getUser();
                const role = await supabase.from('users').select('role').eq('id', user.id);
                if (role !== 'admin') {
                    setError('You do not have permission to access this page.');
                    router.push('/public/dashboard');
                }
                else {
                    setEmail(user.email);
                }
            }
            setLoading(false);
        })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">User Dashboard</h1>
                <p className="text-center">Welcome to your dashboard!</p>
            </div>
        </div>
    );
}
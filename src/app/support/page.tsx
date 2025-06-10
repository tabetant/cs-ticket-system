'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';
export default function SupportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        const checkLoggedin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be logged in to access this page.');
            } else {
                const userResponse = await supabase.auth.getUser();
                setEmail(userResponse.data.user?.email || '');
            }
            setLoading(false);
        }
        checkLoggedin();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
                <p className="text-center">Welcome to your dashboard!</p>
            </div>
        </div>
    );
}
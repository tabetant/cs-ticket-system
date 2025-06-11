'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';

export type Ticket = {
    id: number;
    title: string;
    description: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
    tenant: string;
    attachment_url: string;
    status: 'open' | 'closed' | 'in_progress' | 'resolved';
    updatedAt: string;
}

export default function SupportPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/tickets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Log error for debugging
                console.error(`Error fetching tickets: ${response.statusText}`);
                return;
            }

            const ticketsData = await response.json();
            setTickets(ticketsData);
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    };

    const checkLoggedin = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError('You must be logged in to access this page.');
        } else {
            const userResponse = await supabase.auth.getUser();
            setEmail(userResponse.data.user?.email || '');
        }
    }

    useEffect(() => {
        checkLoggedin();
        fetchTickets();
        setLoading(false);
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
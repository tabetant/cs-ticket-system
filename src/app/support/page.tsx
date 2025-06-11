'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const getStatusColor = (status: string) => {
    switch (status) {
        case "open": return "red";
        case "in_progress": return "yellow";
        case "resolved": return "emerald";
        case "closed": return "gray";
        default: return "gray";
    }
}

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
            <div className="bg-white p-8 rounded shadow-md w-full max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <Card key={ticket.id}>
                            <h2 className="text-lg font-semibold">{ticket.title}</h2>
                            <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>

                            <div className="mt-4 space-y-1 text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">Status: </span>
                                    <Badge color={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                </p>
                                <p><span className="font-medium">Submitted:</span> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-medium">Tenant:</span> {ticket.tenant}</p>
                                <p>
                                    <span className="font-medium">Customer:</span> {ticket.firstName} {ticket.lastName} — {ticket.email} - {ticket.phone}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

            </div >
        </div >
    );
}
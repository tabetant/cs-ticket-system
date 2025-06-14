'use client';
import { useState, useEffect, useMemo, createRef } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import Draggable from 'react-draggable';
import { useTicketFilter } from '../ui/TicketFilterContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/Dropdown';

const getStatusColor = (status: string) => {
    switch (status) {
        case "open": return "red";
        case "in_progress": return "yellow";
        case "resolved": return "emerald";
        case "closed": return "gray";
        default: return "gray";
    }
};

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
};

export default function SupportPage() {
    const { filter } = useTicketFilter();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const nodeRefs = useMemo(() => {
        const refs: Record<number, React.RefObject<HTMLDivElement | null>> = {};
        tickets.forEach(ticket => {
            refs[ticket.id] = createRef<HTMLDivElement>();
        });
        return refs;
    }, [tickets]);

    async function updateStatus(ticketId: number, newStatus: string) {
        try {
            fetch('api/tickets/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: ticketId, status: newStatus }),
            }).then(async response => {
                if (!response.ok) {
                    throw new Error(`Error updating ticket status: ${response.statusText}`);
                }
                // ✅ Re-fetch updated tickets after status change
                const updatedResponse = await fetch('/api/tickets');
                const updatedTickets = await updatedResponse.json();
                setTickets(updatedTickets);
            });
            ;
        } catch (error) {
            console.error('Failed to update ticket status:', error);
            setError('Failed to update ticket status. Please try again later.');
        }
    }


    useEffect(() => {
        const checkLoggedin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be logged in to access this page.');
                router.push('/login');
            } else {
                const userResponse = await supabase.auth.getUser();
                setEmail(userResponse.data.user?.email || '');
            }
        };

        const fetchTickets = async () => {
            try {
                const response = await fetch('/api/tickets');
                if (!response.ok) {
                    console.error(`Error fetching tickets: ${response.statusText}`);
                    return;
                }
                const ticketsData = await response.json();
                setTickets(ticketsData);
            } catch (error) {
                console.error('Fetch failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedin();
        fetchTickets();
    }, []);

    const filteredTickets = filter === 'all'
        ? tickets
        : tickets.filter(ticket => ticket.status === filter);

    return (
        <div className="flex-1 bg-gray-100 p-6 min-h-screen overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket) => {
                    return (
                        <Draggable
                            key={ticket.id}
                            nodeRef={nodeRefs[ticket.id] as React.RefObject<HTMLDivElement>}
                            handle=".handle"
                        >
                            <div ref={nodeRefs[ticket.id]}>
                                <Card className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                    <div className="handle cursor-move mb-4">
                                        <h2 className="text-xl font-bold text-blue-700">{ticket.title}</h2>
                                    </div>

                                    <p className="text-gray-600 mb-4 italic">{ticket.description}</p>

                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold text-gray-800">Status:</span>
                                            <Badge color={getStatusColor(ticket.status)} className="ml-2">{ticket.status}</Badge>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-800">Submitted:</span>
                                            <span className="ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-800">Tenant:</span>
                                            <span className="ml-1">{ticket.tenant}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-gray-800">Customer:</span>
                                            <span className="ml-1">{ticket.firstName} {ticket.lastName}</span><br />
                                            <span className="ml-6 text-gray-500">{ticket.email} — {ticket.phone}</span>
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition">Edit Status</button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-48">
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'open') }} shortcut="⌘o">Open</DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'in_progress') }} shortcut="⌘p">In Progress</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                        onSelect={() => { updateStatus(ticket.id, 'resolved') }} shortcut="⌘r">Resolved</DropdownMenuItem>
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-gray-700 cursor-pointer transition-colors"
                                                    onSelect={() => { updateStatus(ticket.id, 'closed') }} shortcut="⇧⌘c">Closed</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </Card>
                            </div>
                        </Draggable>
                    );
                })}
            </div>
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={async () => await supabase.auth.signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

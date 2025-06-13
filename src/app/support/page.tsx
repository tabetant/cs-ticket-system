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
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`Error updating ticket status: ${response.statusText}`);
                }
                return response.json();
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
                                <Card>
                                    <div className="handle cursor-move">
                                        <h2 className="text-lg font-semibold">{ticket.title}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
                                    <div className="mt-4 space-y-1 text-sm text-gray-700">
                                        <p>
                                            <span className="font-medium">Status: </span>
                                            <Badge color={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                        </p>
                                        <p>
                                            <span className="font-medium">Submitted:</span>{" "}
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium">Tenant:</span> {ticket.tenant}
                                        </p>
                                        <p>
                                            <span className="font-medium">Customer:</span> {ticket.firstName} {ticket.lastName}
                                            <br />
                                            {ticket.email} — {ticket.phone}
                                        </p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button>Edit Status</button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem onSelect={() => { updateStatus(ticket.id, 'open') }} shortcut="⌘o">Open</DropdownMenuItem>
                                                </DropdownMenuGroup>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem onSelect={() => { updateStatus(ticket.id, 'in_progress') }} shortcut="⌘p">In Progress</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => { updateStatus(ticket.id, 'resolved') }} shortcut="⌘r">Resolved</DropdownMenuItem>
                                                </DropdownMenuGroup>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem onSelect={() => { updateStatus(ticket.id, 'closed') }} shortcut="⇧⌘c">Closed</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                </Card>
                            </div>
                        </Draggable>
                    );
                })}
            </div>
        </div>
    );
}

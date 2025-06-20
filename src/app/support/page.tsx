'use client';
import { useState, useEffect, useMemo, createRef } from 'react';
import { supabase } from '@/db/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

import {
    Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger
} from '../ui/Popover';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/Dropdown';

const getStatusVariant = (status: string): BadgeProps["variant"] => {
    switch (status) {
        case "open": return "error";
        case "in_progress": return "warning";
        case "resolved": return "success";
        case "closed": return "neutral";
        default: return "default";
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
    logs: string;
};

export default function SupportPage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status') ?? 'all';
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
            fetch(`api/tickets?status=${status}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': email as string,
                },
                body: JSON.stringify({ id: ticketId, status: newStatus, log: `Status changed to ${newStatus} by ${email} on ${new Date()}` }),
            }).then(async response => {
                if (!response.ok) {
                    throw new Error(`Error updating ticket status: ${response.statusText}`);
                }
                // ✅ Re-fetch updated tickets after status change
                const updatedResponse = await fetch(`api/tickets?status=${status}`);
                const updatedTickets = await updatedResponse.json();
                setTickets(updatedTickets.tickets);
            });
            ;
        } catch (error) {
            console.error('Failed to update ticket status:', error);
            setError('Failed to update ticket status. Please try again later.');
        }
    }
    const fetchTickets = async () => {
        try {
            const response = await fetch(`api/tickets?status=${status}`);
            if (!response.ok) {
                console.error(`Error fetching tickets: ${response.statusText}`);
                return;
            }
            const ticketsData = await response.json();

            setTickets(ticketsData.tickets);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

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

        checkLoggedin();
        fetchTickets();
    }, [status, router]);

    async function handleDelete(id: number) {
        try {
            const response = await fetch(`api/tickets?status=${status}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
            if (!response.ok) {
                throw new Error(`Error deleting ticket: ${response.statusText}`);
            }
            // Optionally re-fetch tickets after deletion
            fetchTickets();
        } catch (error) {
            console.error('Failed to delete ticket:', error);
            setError('Failed to delete ticket. Please try again later.');
        }
        fetchTickets();
    }


    const statuses = ["open", "in_progress", "resolved", "closed"];

    interface DropEvent extends React.DragEvent<HTMLDivElement> { }

    interface HandleDrop {
        (e: DropEvent, newStatus: Ticket['status']): void;
    }

    const handleDrop: HandleDrop = (e, newStatus) => {
        e.preventDefault();
        const ticketId = parseInt(e.dataTransfer.getData("ticketId"));
        updateStatus(ticketId, newStatus);
    };

    return (
        <div className="flex-1 bg-gray-100 p-6 min-h-screen overflow-auto">
            {status === "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statuses.map((statusItem) => (
                        <div
                            key={statusItem}
                            onDrop={(e) => handleDrop(e, statusItem as Ticket['status'])}
                            onDragOver={(e) => e.preventDefault()}
                            className="bg-white rounded-lg shadow p-4 min-h-[300px] flex flex-col gap-4"
                        >
                            <h2 className="text-lg font-bold capitalize border-b pb-2 mb-2 text-blue-800">{statusItem.replace("_", " ")}</h2>
                            {tickets.filter(ticket => ticket.status === statusItem).map((ticket) => {
                                let logEntries: any[] = [];
                                try {
                                    logEntries = typeof ticket.logs === 'string'
                                        ? JSON.parse(ticket.logs || '[]')
                                        : ticket.logs || [];
                                } catch (e) {
                                    console.error("Failed to parse logs:", ticket.logs, e);
                                    logEntries = [];
                                }
                                return (
                                    <div
                                        key={ticket.id}
                                        draggable
                                        onDragStart={(e) => e.dataTransfer.setData("ticketId", String(ticket.id))}
                                    >
                                        <Card className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="cursor-move mb-4">
                                                <h2 className="text-xl font-bold text-blue-700">{ticket.title}</h2>
                                            </div>
                                            <p className="text-gray-600 mb-4 italic">{ticket.description}</p>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <p>
                                                    <span className="font-semibold text-gray-800">Status:</span>
                                                    <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
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
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex flex-col gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition">
                                                                View Logs
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80 p-4">
                                                            {logEntries.length > 0 ? (
                                                                <ul className="space-y-3">
                                                                    {logEntries.map((entry: any, index: number) => (
                                                                        <li key={index} className="border-b last:border-none pb-2">
                                                                            <p className="text-gray-800">
                                                                                <span className="font-medium text-blue-700">{entry.user}</span>{" "}
                                                                                <span>changed status to</span>{" "}
                                                                                <span className="font-semibold text-green-600">{entry.message.split("to")[1]?.trim()}</span>
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p className="italic text-gray-500">No history yet.</p>
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <button
                                                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                                                    onClick={() => handleDelete(ticket.id)}
                                                >
                                                    <span>🗑️</span>
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => {
                        let logEntries: any[] = [];
                        try {
                            logEntries = typeof ticket.logs === 'string'
                                ? JSON.parse(ticket.logs || '[]')
                                : ticket.logs || [];
                        } catch (e) {
                            console.error("Failed to parse logs:", ticket.logs, e);
                            logEntries = [];
                        }
                        return (
                            <Card key={ticket.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-blue-700">{ticket.title}</h2>
                                </div>
                                <p className="text-gray-600 mb-4 italic">{ticket.description}</p>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>
                                        <span className="font-semibold text-gray-800">Status:</span>
                                        <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
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
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex flex-col gap-2">
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
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md hover:bg-gray-300 transition">
                                                    View Logs
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-4">
                                                {logEntries.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {logEntries.map((entry: any, index: number) => (
                                                            <li key={index} className="border-b last:border-none pb-2">
                                                                <p className="text-gray-800">
                                                                    <span className="font-medium text-blue-700">{entry.user}</span>{" "}
                                                                    <span>changed status to</span>{" "}
                                                                    <span className="font-semibold text-green-600">{entry.message.split("to")[1]?.trim()}</span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="italic text-gray-500">No history yet.</p>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <button
                                        className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                                        onClick={() => handleDelete(ticket.id)}
                                    >
                                        <span>🗑️</span>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
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


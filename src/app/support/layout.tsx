'use client'
import { TicketFilterProvider } from '../ui/TicketFilterContext';
import SideBar from "../ui/SideBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <TicketFilterProvider>
            <div className="flex min-h-screen bg-gray-100"> {/* ← flex container */}
                <SideBar />
                <main className="flex-1 p-4 bg-gray-50">
                    {children}
                </main>
            </div>
        </TicketFilterProvider>
    );
}

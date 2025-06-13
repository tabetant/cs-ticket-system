'use client' // adjust path if needed
import Link from "next/link";
import { TicketFilterProvider } from '../ui/TicketFilterContext';
import SideBar from "../ui/SideBar";
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <TicketFilterProvider>
            <SideBar />
        </TicketFilterProvider >
    );
}

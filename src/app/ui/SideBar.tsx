'use client'
import { useTicketFilter } from '../ui/TicketFilterContext';
import { TabNavigation, TabNavigationLink } from "../ui/TabNavigation";
export default function SideBar() {
    const { setFilter } = useTicketFilter();
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar Navbar */}
            <div className="w-64 bg-white border-r border-gray-200 shadow-md min-h-screen p-4">
                <h1 className="text-xl font-bold mb-6">Support Panel</h1>
                <TabNavigation className="flex-col space-y-2">
                    <TabNavigationLink asChild>
                        <button onClick={() => setFilter('all')}>📋 All Tickets</button>
                    </TabNavigationLink>
                    <TabNavigationLink asChild>
                        <button onClick={() => setFilter('open')}>🟢 Open</button>
                    </TabNavigationLink>
                    <TabNavigationLink asChild>
                        <button onClick={() => setFilter('closed')}>🔒 Closed</button>
                    </TabNavigationLink>
                </TabNavigation>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
    )
}

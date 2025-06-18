'use client';
import { TabNavigation, TabNavigationLink } from "../ui/TabNavigation";
import { useRouter } from "next/navigation";
export default function SideBar() {
    const router = useRouter();
    function handleFilterChange(newStatus: string) {
        router.push(`/support?status=${newStatus}`);
    }
    return (
        <div className="w-64 bg-white border-r border-gray-200 shadow-md min-h-screen p-4">
            <h1 className="text-xl font-bold mb-6">Support Panel</h1>
            <TabNavigation className="flex-col space-y-2">
                <TabNavigationLink asChild>
                    <button
                        onClick={() => handleFilterChange('all')}

                    >
                        📋 All Tickets
                    </button>
                </TabNavigationLink>
                <TabNavigationLink asChild>
                    <button onClick={() => handleFilterChange('open')}>🟢 Open</button>
                </TabNavigationLink>
                <TabNavigationLink asChild>
                    <button onClick={() => handleFilterChange('in_progress')}>🛠️ In Progress</button>
                </TabNavigationLink>
                <TabNavigationLink asChild>
                    <button onClick={() => handleFilterChange('resolved')}>✅ Resolved</button>
                </TabNavigationLink>
                <TabNavigationLink asChild>
                    <button onClick={() => handleFilterChange('closed')}>🔒 Closed</button>
                </TabNavigationLink>
            </TabNavigation>
        </div>
    );
}

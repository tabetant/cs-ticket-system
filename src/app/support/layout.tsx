import { TabNavigation, TabNavigationLink } from "../ui/TabNavigation"; // adjust path if needed
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (

        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar Navbar */}
            <div className="w-64 bg-white border-r border-gray-200 shadow-md min-h-screen p-4">
                <h1 className="text-xl font-bold mb-6">Support Panel</h1>
                <TabNavigation className="flex-col space-y-2">
                    <TabNavigationLink asChild>
                        <Link href="/support">📋 All Tickets</Link>
                    </TabNavigationLink>
                    <TabNavigationLink asChild>
                        <Link href="/support/open">🟢 Open</Link>
                    </TabNavigationLink>
                    <TabNavigationLink asChild>
                        <Link href="/support/closed">🔒 Closed</Link>
                    </TabNavigationLink>
                </TabNavigation>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>

    );
}

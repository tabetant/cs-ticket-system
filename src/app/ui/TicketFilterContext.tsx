'use client';

import { createContext, useContext, useState } from 'react';

type TicketFilterContextType = {
    filter: string;
    setFilter: (filter: string) => void;
};

const TicketFilterContext = createContext<TicketFilterContextType | undefined>(undefined);

export function TicketFilterProvider({ children }: { children: React.ReactNode }) {
    const [filter, setFilter] = useState("all");

    return (
        <TicketFilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </TicketFilterContext.Provider>
    );
}

export function useTicketFilter() {
    const context = useContext(TicketFilterContext);
    if (!context) {
        throw new Error("useTicketFilter must be used within a TicketFilterProvider");
    }
    return context;
}

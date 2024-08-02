import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SidebarContextType {
    isSidebarHidden: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarHidden(prevState => !prevState);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarHidden, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export { SidebarProvider, useSidebar };

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

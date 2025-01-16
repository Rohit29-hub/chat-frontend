import React, { createContext, useContext, useCallback } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
    mySocketId: string | null,
    socket: Socket | null,
    handleSocket: (socket: Socket | null) => void,
};

const SocketContext = createContext<SocketContextType | null>(null);

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [mySocketId, setMySocketId] = React.useState<string | null>(null);

    // Memoize handleSocket to prevent unnecessary re-renders
    const handleSocket = useCallback((socket: Socket | null) => {
        setSocket(socket);
        if (socket) {
            setMySocketId(socket.id ? socket.id : null);
        } else {
            setMySocketId(null);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ mySocketId, socket, handleSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContextProvider, useSocket };

const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketContextProvider');
    }
    return context;
};

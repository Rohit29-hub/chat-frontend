import { useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

export const useTyping = (socket: Socket | null, userId: string | undefined) => {
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    const handleTyping = () => {
        if (!isTyping && socket && userId) {
            setIsTyping(true);
            socket.emit('typing_start', userId);
        }
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket?.emit('typing_end', userId);
        }, 1000);
    };

    const resetTyping = () => {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        socket?.emit('typing_end', userId);
    };

    return { isTyping, handleTyping, resetTyping };
};
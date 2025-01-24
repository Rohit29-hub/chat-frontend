import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage } from '../redux/slices/chatSlice';
import { MessageType, userType } from '../types/user';

type SocketSetupProps = {
    handleSocket: (socket: Socket | null) => void;
    setOnlineUsers: (users: [string, userType][]) => void;
}

export const useSocketSetup = ({
    handleSocket,
    setOnlineUsers,
}: SocketSetupProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_URL}`, {
            auth: {
                token: localStorage.getItem('token'),
            }
        });

        socket.on('connect', () => {
            handleSocket(socket);
        });

        socket.on('message', (data: MessageType) => {
            console.log(data);
            dispatch(addMessage(data));
        });

        socket.on('online_users', (onlineUsers: [string, userType][]) => {
            setOnlineUsers(onlineUsers);
        });

        socket.on('disconnect', () => {
            handleSocket(null);
        });

        socket.on('hello', (data) => {
            console.log(data);
        })

        return () => {
            socket.disconnect();
        };
    }, [handleSocket, setOnlineUsers, dispatch]);
};
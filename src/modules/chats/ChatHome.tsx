import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { addSocket } from '../../redux/slices/socketSlice';
import { addMessage } from '../../redux/slices/chatSlice';
import { useSidebar } from '../../context/sideBarToggleProvider';

export type userType = {
    username: string,
    img: string,
    desc: string
}

const ChatHome = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState<userType | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Array<any> | null>(null);
    const { my_socket_id } = useSelector((states: any) => states.socket);
    const {isSidebarHidden,toggleSidebar} = useSidebar();

    // getting user data from a server
    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const res = await fetch('https://chat-backend-puxf.onrender.com/api/user/get_user_details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })

            const data = await res.json();

            if (!data.success) {
                return navigate('/login');
            }

            setUserData(data.body.profile);
        }

        getUser();
    }, []);

    // established a socket connection with server
    useEffect(() => {
        const socket = io('https://chat-backend-puxf.onrender.com', {
            auth: {
                token: localStorage.getItem('token'),
            }
        })

        socket.on('connect', () => {
            dispatch(addSocket(socket));
        })

        socket.on('message', ({ sender, receiver, message, createdAt }) => {
            const data = {
                sender,
                receiver,
                message,
                createdAt: new Date(),
            }
            console.log("========-------=======");
            console.log(sender, receiver, message, createdAt);
            console.log("========-------=======");
            dispatch(addMessage({
                sender,
                receiver,
                message: data,
                timestamps: createdAt
            }));
        })


        socket.on('online_users', (onlineUsers) => {
            console.log(onlineUsers);
            setOnlineUsers(onlineUsers);
        })

        socket.on('disconnect', () => {
            dispatch(addSocket(null));
            console.log('Disconnected from server');
        })

        return () => {
            socket.disconnect();
        };

    }, [])

    const connectWithFriend = (socketid: string, userid: string) => {
        navigate(`/chats/${socketid}?userid=${userid}`);
        toggleSidebar();
    }

    return userData && my_socket_id ? (
        <div className="bg-gray-100 mr-4 absolute left-0 sm:relative w-full h-screen flex p-2 border-2 gap-2">
            <div className={`sidebar w-56 mr-4 absolute left-0 sm:relative z-50 ${isSidebarHidden ? 'block' : 'hidden'} sm:block  bg-white flex-shrink-0 h-full p-2 rounded shadow-md`}>
                <div className="w-full h-full flex flex-col gap-y-3 px-3">
                    {
                        <div className="w-full sticky top-0 pb-3 flex justify-between items-center">
                            <h1 className="font-semibold text-xl">{userData.username}</h1>
                            <Edit cursor={'pointer'} size={22} />
                        </div>
                    }
                    <div className="pb-3">
                        <h1 className="text-xl">Messages</h1>
                    </div>
                    <div className=''>
                        {
                            (onlineUsers?.length != 1 && onlineUsers != null) ? onlineUsers.map(([key, user]: any) => (
                                key != my_socket_id ? (
                                    <div key={key} onClick={() => connectWithFriend(key,user.user)} className="my-4 flex gap-x-2 items-center">
                                        <div className="relative">
                                            <img src={user.img} alt="" className="w-10 h-10" />
                                            <div className="absolute right-0 bottom-0 p-1 rounded-full bg-green-400 border-2 border-white"></div>
                                        </div>
                                        <div>

                                            <h1 className="font-normal">{user.username}</h1>
                                            <p className="text-xs text-gray-500">Active now</p>
                                        </div>
                                    </div>
                                ) : null
                            )) : <div className='mt-2 border rounded-md p-2 border-red-500'>
                                <p className='text-xl'>Nobody is online</p>
                                <p className='text-xs'>wait...</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white w-full h-full">
                <Outlet />
            </div>
        </div>
    ) : <div className='w-full h-screen flex items-center justify-normal'>Loading...</div>
}

export default ChatHome

import { Bell, Home, LogOut, MessageCircleMore, Search, SettingsIcon, Sidebar } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { addMessage } from '../../redux/slices/chatSlice';
import { useSocket } from '../../context/socketProvider';
import { getData } from '../../utils/action';

export type userType = {
    user: string,
    username: string,
    img: string,
    desc: string,
    status: string
}

const ChatHome = () => {
    const navigate = useNavigate();
    const [showSideBar, setShowSideBar] = useState(false);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState<userType | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[] | null>(null);
    const { handleSocket, mySocketId } = useSocket();

    // getting user data from a server
    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            const data = await getData(token!);
            setUserData(data.profile);
        }
        getUser();
    }, []);

    // Established a socket connection with server and listen all the socket's event
    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_URL}`, {
            auth: {
                token: localStorage.getItem('token'),
            }
        })

        socket.on('connect', () => {
            handleSocket(socket);
        })

        socket.on('message', (data) => {
            dispatch(addMessage(data));
        })

        socket.on('online_users', (onlineUsers) => {
            setOnlineUsers(onlineUsers);
        })

        socket.on('disconnect', () => {
            handleSocket(null);
        })

        return () => {
            socket.disconnect();
        };

    }, [])


    // used to connect with friend
    const connectWithFriend = (userid: string) => {
        setShowSideBar(false);
        navigate(`/chats/${userid}`);
    }

    return userData && mySocketId ? (
        <div className="chat-container w-full h-screen bg-[#EFF6FC] gap-4 md:py-2 md:px-4">
            <div className='md:block hidden navContainer border shadow rounded-2xl bg-[#6E00FF]'>
                <div className='w-full h-full py-3  flex items-center justify-between flex-col'>
                    <img className='w-12 h-12 rounded-full border-2 border-[#5322BC]' src={userData.img} alt="" />
                    <div className='flex-1 w-full flex flex-col gap-y-16 pt-10 items-center'>
                        <Link to={'/'}><Home size={30} color='white' /></Link>
                        <Link to={'/'}><MessageCircleMore size={30} color='white' /></Link>
                        <Link to={'/'}><Bell size={30} color='white' /></Link>
                        <Link to={'/'}><SettingsIcon size={30} color='white' /></Link>
                    </div>
                    <div>
                        <LogOut size={30} color='white' />
                    </div>
                </div>
            </div>

            <div className={`sidebarContainer rounded-2xl ${showSideBar ? 'flex' : 'md:flex hidden'} flex-col gap-y-2 p-2 sm:p-0`}>
                <div className='w-full h-10 flex items-center px-1 shadow overflow-hidden rounded-2xl relative bg-white border'>
                    <div className='inline'><Search size={22} color='black' /></div>
                    <input type="text" className='w-full h-full pl-2 outline-none border-none text-base' placeholder='Search' />
                </div>
                <div className='w-full flex-1 flex flex-col gap-3'>
                    <div className='flex-1 bg-white shadow rounded-xl overflow-hidden px-3'>
                        <h1 className='text-xl font-medium sticky top-0 bg-white py-3 border-b'>Peoples</h1>
                        <div className='overflow-y-auto w-full h-full'>
                            {
                                onlineUsers ? (onlineUsers.map(([usersKey, userData]: [string, userType]) => (
                                    mySocketId != usersKey && (
                                        <div key={usersKey} className='flex w-full py-2 border-b items-center justify-between cursor-pointer hover:bg-gray-100' onClick={() => connectWithFriend(userData.user)}>
                                            <div className='w-full h-auto flex gap-x-2'>
                                                <div className='w-11 h-11 relative'>
                                                    <img className='w-full h-full object-contain rounded-full border-2 border-blue-500' src={userData.img} alt={userData.username} />
                                                    <span className={`${userData.status == 'online' && 'absolute z-10 left-1 top-0 p-1.5 bg-green-400 rounded-full'}`}></span>
                                                </div>
                                                <div>
                                                    <h1 className={`text-base font-medium`}>
                                                        {userData.username}
                                                    </h1>
                                                    <p className='text-sm text-gray-400'>{userData.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))) : (
                                    <div>
                                        <h1>Loading...</h1>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className='chatViewContainer border overflow-hidden md:rounded-2xl bg-white shadow md:py-3 md:px-4'>
                <Outlet context={[setShowSideBar]} />
            </div>
        </div>
    ) : (
        <div className='w-full h-screen flex items-center justify-normal'>
            <p>Loading...</p>
        </div>
    )
}

export default ChatHome;

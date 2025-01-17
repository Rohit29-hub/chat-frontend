import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useSocketSetup } from '../../hooks/useSocketSetup';
import { useSocket } from '../../context/socketProvider';
import { TypingData, userType } from '../../types/user';
import { getData } from '../../utils/action';
import Navbar from '../../components/chat/Navbar';
import UserList from '../../components/chat/UserList';
import { useFriendStatus } from '../../context/friendStatusProvider';

const ChatHome = () => {
    const navigate = useNavigate();
    const [showSideBar, setShowSideBar] = useState(false);
    const [myData, setMyData] = useState<userType | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<[string, userType][] | null>(null);
    const { socket, handleSocket, mySocketId } = useSocket();
    const { setFriendStatus } = useFriendStatus();

    useSocketSetup({ handleSocket, setOnlineUsers });

    useEffect(() => {
        socket?.on('user_typing', (data: TypingData) => {
            if (data.userId) {
                setFriendStatus(data);
            }
        });
    }, [socket])


    // Fetch my data
    useEffect(() => {
        const getMyData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            const data = await getData(token);
            setMyData(data.profile);
        };
        getMyData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const connectWithFriend = (userId: string) => {
        setShowSideBar(false);
        navigate(`/chats/${userId}`);
    };

    if (!myData || !mySocketId) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex items-center bg-[#EFF6FC] gap-x-2 md:gap-4 md:py-2 md:px-4">
            <div className={`${showSideBar ? 'block' : 'hidden sm:block'}`}>
                <Navbar
                    userData={myData}
                    onLogout={handleLogout}
                />
            </div>

            <div className={`h-full ${showSideBar ? 'block flex-1' : 'hidden md:flex  '} md:w-80 md:rounded-2xl md:shadow flex-col gap-y-2 overflow-hidden`}>
                <div className='w-full h-full flex flex-col gap-3'>
                    <UserList
                        onlineUsers={onlineUsers}
                        mySocketId={mySocketId}
                        onUserSelect={connectWithFriend}
                    />
                </div>
            </div>

            <div className={`${showSideBar ? 'hidden' : 'block'} flex-1 h-full border overflow-hidden md:rounded-2xl bg-white md:shadow  md:px-4'`}>
                <Outlet context={[setShowSideBar]} />
            </div>
        </div>
    );
};

export default ChatHome;
import { LogOut, Menu, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { userType } from './ChatHome'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, addMessages } from '../../redux/slices/chatSlice';
import { useSidebar } from '../../context/sideBarToggleProvider';
import { jwtDecode } from 'jwt-decode';

function getTimeDifference(pastDate: string) {
    // Parse the dates if they are strings
    const pastDateTime = new Date(pastDate);
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const timeDifferenceMs = currentDate.getTime() - pastDateTime.getTime();

    // Define time constants
    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    // Calculate differences in various units
    const minutes = Math.floor(timeDifferenceMs / millisecondsInMinute);
    const hours = Math.floor(timeDifferenceMs / millisecondsInHour);
    const days = Math.floor(timeDifferenceMs / millisecondsInDay);

    // Determine the appropriate unit to use
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `just now`;
    }
}
const ChatWithFriend = () => {
    const [friendData, setFriendData] = useState<any | null>(null);
    const [friendModal, setFriendModal] = useState(false);
    const [friendProfile, setFriendProfile] = useState<userType | null>(null);
    const [message, setMessage] = useState<string>("");
    const { userId } = useParams();
    const navigate = useNavigate();
    const { my_socket } = useSelector((states: any) => states.socket);
    const { messages } = useSelector((states: any) => states.chats);
    const dispatch = useDispatch();
    const { toggleSidebar } = useSidebar();
    const token = localStorage.getItem('token');
    const {_id} = jwtDecode<{
        _id: string
    }>(token!)

    const showFriendDetails = () => {
        setFriendModal(true);
    }

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const getFriendData = async () => {
            try {
                if (!token) return navigate('/login');
                const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/user/get_user_details/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })

                const data = await response.json();

                setFriendData(data.body);
                setFriendProfile(data.body.profile);

            } catch (err) {
                console.log(err);
            }
        }
        getFriendData();
    }, [userId])

    useEffect(() => {
        const getMessage = async () => {
            try {
                if (!token) return navigate('/login');
                const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/getMessage/${userId}/${_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                const data = await response.json();
                const parsedMessages = data.messages_data.map((messageString: string) => JSON.parse(messageString))
                dispatch(addMessages(parsedMessages));

            } catch (err) {
                console.log(err);
            }
        }
        getMessage();
    }, [userId])

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        
        if (message.trim().length == 0) {
            return;
        }

        const data = {
            sender: _id,
            receiver: userId,
            message,
            timestamps: new Date(),
        }

        if (my_socket.connected) {
            my_socket.emit('message', data);
            setMessage("");
        }

        dispatch(addMessage(data))

        fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/add_message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token!
            },
            body: JSON.stringify({
                sender: _id,
                message: data.message,
                receiver: userId,
                timestamps: data.timestamps
            })
        }).then((data) => data.json())
            .then(() => console.log("message saved !"))
            .catch((err) => console.error(err.message))
    }


    function doLogout(){
        localStorage.removeItem('token');
        navigate('/login');
    }



    return friendProfile ? (
        <div className="chat_box_top_bar bg-white flex flex-col items-center justify-between rounded shadow-md w-full h-full relative">
            <div onClick={showFriendDetails} className="w-full h-16 flex items-center justify-between p-2 border-b shadow">
                <div className="flex gap-x-2 items-center">
                    <img src={friendProfile.img} alt="" className="w-10 h-10" />
                    <h1>{friendProfile.username}</h1>
                </div>
                <div className='flex gap-x-3'>
                    <button onClick={doLogout} title="Logout" className="flex gap-x-2">
                        Logout
                        <LogOut />
                    </button>
                    <button type="button" onClick={toggleSidebar} className="font-normal sm:hidden block"><Menu /></button>
                </div>
            </div>
            <div className='chat_box w-full overflow-y-auto flex-1 bg-white rounded shadow-md px-3'>
                <div className='mt-3'>
                    {
                        messages ? (
                            messages.map((messageData: any, index: number) => (
                                <div key={index} className={`flex gap-x-2 items-center mt-2 ${messageData.sender === _id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-3 py-1 ${messageData.sender === _id ? 'bg-green-400' : 'bg-red-400'} rounded-lg`}>
                                        <p className='text-sm font-medium'>{messageData.message}</p>
                                        <p className='text-xs'>{getTimeDifference(messageData.timestamps)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex items-center justify-center'> <p className='text-xl'>No messages yet.</p></div>
                        )
                    }
                    <div ref={endOfMessagesRef} />
                </div>
            </div>
            <form onSubmit={sendMessage} className='chat_box w-full h-20 p-2 gap-x-2 flex items-center bg-white rounded shadow-md'>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} id="message" name="message" placeholder="Your message here"
                    className="mt-1 block w-full px-3 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
                <button type="submit"
                    className=" bg-blue-500 hover:bg-blue-600 flex-shrink-0 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline">
                    Send
                </button>
            </form>
            {
                friendModal && (
                    <div className='absolute left-0 right-0 w-full h-screen p-2 backdrop-blur-md z-50'>
                        <div className='w-full h-full bg-white relative flex items-center justify-center'>
                            <div onClick={() => setFriendModal(false)} className='absolute right-2 top-2 '>
                                <X />
                            </div>
                            <p className='text-black text-xl sm:text-3xl underline'>{friendData.fullname}</p>
                        </div>
                    </div>
                )
            }
        </div>
    ) : <div className='w-full h-screen flex items-center justify-center'>Loading...</div>
}

export default ChatWithFriend

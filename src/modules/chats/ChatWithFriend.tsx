import { LogOut, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { userType } from './ChatHome'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { addMessage, addMessages } from '../../redux/slices/chatSlice';
import { useSidebar } from '../../context/sideBarToggleProvider';

type jwtDecodeData = {
    _id: string,
}

const ChatWithFriend = () => {
    const [friendData, setFriendData] = useState<userType | null>(null);
    const [message, setMessage] = useState<string>("");
    const params = new URLSearchParams(window.location.search);
    const { socketId } = useParams();
    const navigate = useNavigate();
    const { my_socket_id, my_socket } = useSelector((states: any) => states.socket);
    const { messages } = useSelector((states: any) => states.chats);
    const dispatch = useDispatch();
    const {toggleSidebar} = useSidebar();
    const token = localStorage.getItem('token');
    const info = jwtDecode<jwtDecodeData>(token!);

    useEffect(() => {
        const getFriendData = async () => {
            try {
                if (!token) return navigate('/login');
                const userId = params.get('userid');

                const response = await fetch(`https://chat-backend-puxf.onrender.com/api/user/get_user_details/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })

                const data = await response.json();

                setFriendData(data.body.profile);

            } catch (err) {
                console.log(err);
            }
        }
        getFriendData();
    }, [socketId])

    useEffect(() => {
        const getMessage = async () => {
            try {
                if (!token) return navigate('/login');
                const userId = params.get('userid');

                const response = await fetch(`https://chat-backend-puxf.onrender.com/api/message/getMessage/${userId}/${info._id}`, {
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
    }, [socketId])

    const sendMessage = async () => {
        const reciverId = params.get('userid');
        const data = {
            sender: info._id,
            receiver: reciverId,
            message,
            createdAt: new Date(),
        }

        if (my_socket.connected) {
            my_socket.emit('message', {
                sender: info._id,
                receiver: reciverId,
                socketinfo: {
                    sender: my_socket_id,
                    receiver: socketId,
                },
                message,
                createdAt: new Date(),
            });

            setMessage("");
        }

        dispatch(addMessage({
            sender: info._id,
            reciver: reciverId,
            message: data,
            timestamps: new Date()
        }))

        fetch('https://chat-backend-puxf.onrender.com/api/message/add_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token!
            },
            body: JSON.stringify({
                senderId: info._id,
                message: data,
                reciverId,
            })
        }).then((data) => data.json())
            .then(() => console.log("message saved !"))
            .catch((err) => console.error(err.message))
    }

    return friendData ? (
        <div className="chat_box_top_bar bg-white flex flex-col items-center justify-between rounded shadow-md w-full h-full relative">
            <div className="w-full h-16 flex items-center justify-between p-2 border-b shadow">
                <div className="flex gap-x-2 items-center">
                    <img src={friendData.img} alt="" className="w-10 h-10" />
                    <h1>{friendData.username}</h1>
                </div>
                <div className='flex gap-x-3'>
                    <button onClick={() => {
                        alert('Logout button not working right now !')
                    }} title="Logout" className="flex gap-x-2">
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
                                <div key={index} className={`flex gap-x-2 items-center mt-2 ${messageData.sender === info._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-3 py-1 ${messageData.sender === info._id ? 'bg-green-400' : 'bg-red-400'} rounded-lg`}>
                                        <p className='text-sm font-medium'>{messageData.message.message}</p>
                                        <p className='text-xs'>{new Date(messageData.timestamps).getMinutes() + "m ago"}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No messages yet.</div>
                        )
                    }
                </div>
            </div>
            <div className='chat_box w-full h-20 p-2 gap-x-2 flex items-center bg-white rounded shadow-md'>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} id="message" name="message" placeholder="Your message here"
                    className="mt-1 block w-full px-3 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150" />
                <button onClick={sendMessage} type="submit"
                    className=" bg-blue-500 hover:bg-blue-600 flex-shrink-0 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline">
                    Send
                </button>
            </div>
        </div>
    ) : <div className='w-full h-screen flex items-center justify-center'>Loading...</div>
}

export default ChatWithFriend
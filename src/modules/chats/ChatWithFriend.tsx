import { SmilePlus, Send, MoreVerticalIcon, } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { userType } from './ChatHome'
import { useOutletContext, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, addMessages } from '../../redux/slices/chatSlice';
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '../../context/socketProvider';
import { getData, getMessage, saveMessage } from '../../utils/action';
import MessageList from '../../components/ui/MessageList';


const ChatWithFriend = () => {
    const [friendData, setFriendData] = useState<any | null>(null);
    const [friendProfile, setFriendProfile] = useState<userType | null>(null);
    const [message, setMessage] = useState<string>("");
    const { userId } = useParams();
    const navigate = useNavigate();
    const { messages } = useSelector((states: any) => states.chats);
    const { socket } = useSocket();
    const dispatch = useDispatch();

    // use the outletcontext
    const [setShowSideBar]: any = useOutletContext();

    // using localstorege token
    const token = localStorage.getItem('token');
    const { _id } = jwtDecode<{ _id: string }>(token!);

    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // use to get the friend data
    useEffect(() => {
        if (!token) return navigate('/login');
        const getFriendData = async () => {
            const data = await getData(token!, userId!);
            setFriendData(data);
            setFriendProfile(data.profile);
        }
        getFriendData();
    }, [userId])

    // use to get the message of the user
    useEffect(() => {
        const getMsg = async () => {
            const parsedMessages = await getMessage(token!, userId!, _id);
            dispatch(addMessages(parsedMessages));
        }
        getMsg();
    }, [userId])

    // save the message and push into messages state
    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (message.trim().length == 0) return;

        const data = {
            sender: _id,
            receiver: userId!,
            message,
            timestamps: new Date().toISOString(),
        }

        if (socket!.connected) {
            socket!.emit('message', data);
            setMessage("");
        }

        dispatch(addMessage(data))
        saveMessage(token!, data);
    }

    return friendProfile ? (
        <div className="w-full h-full flex flex-col justify-between p-2">
            <nav className='w-full pb-2 border-b flex items-center justify-between'>
                <div className='flex items-center gap-x-2'>
                    <div>
                        <img className='w-12 h-12 ' src={friendProfile.img} alt="" />
                    </div>
                    <div>
                        <h1 className='text-xl font-medium'>{friendProfile.username}</h1>
                    </div>
                </div>
                <div className='md:hidden block' onClick={() => setShowSideBar(true)}>
                    <MoreVerticalIcon/>
                </div>
            </nav>
            <div className='w-full flex-1 overflow-y-auto no-scrollbar'>
                <MessageList messages={messages} _id={_id} />
                <div ref={endOfMessagesRef}></div>
            </div>
            <div className='w-full h-12 flex items-center gap-x-3'>
                <div className='w-full h-full border flex items-center gap-x-4 px-4 rounded-2xl overflow-hidden bg-[#EFF6FC]'>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-full h-full text-sm font-medium outline-none border-none bg-transparent' type="text" placeholder='Type your message here..' />
                    <div><SmilePlus size={24} color='black' /></div>
                </div>
                <button onClick={sendMessage} className='bg-[#6E00FF] flex-shrink-0 p-2 rounded-md flex items-center justify-center'>
                    <Send size={24} color='white' />
                </button>
            </div>
        </div>
    ) : <div className='w-full h-screen flex items-center justify-center'>Loading...</div>
}

export default ChatWithFriend

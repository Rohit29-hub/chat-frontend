import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { addMessage, addMessages } from '../../redux/slices/chatSlice';
import { useSocket } from '../../context/socketProvider';
import { MessageType, userType } from '../../types/user';
import { useTyping } from '../../hooks/useTyping';
import { getData, getMessage, saveMessage } from '../../utils/action';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/ui/MessageList';
import MessageInput from '../../components/chat/MessageInput';

const ChatWithFriend = () => {
    const [friendProfile, setFriendProfile] = useState<userType | null>(null);
    const [message, setMessage] = useState("");
    const { userId } = useParams();
    const navigate = useNavigate();
    const { messages } = useSelector((states: any) => states.chats);
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const { _id } = token ? jwtDecode<{ _id: string }>(token) : { _id: '' };
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    const { handleTyping, resetTyping } = useTyping(socket, userId);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {

        if (!token) {
            navigate('/login');
            return;
        }
        const getFriendData = async () => {
            try {
                const data = await getData(token, userId!);
                setFriendProfile(data.profile);
            } catch (error) {
                console.error('Error fetching friend data:', error);
                navigate('/');
            }
        };

        getFriendData();
    }, [userId, token, navigate]);

    useEffect(() => {
        const getMessageHistory = async () => {
            try {
                const parsedMessages = await getMessage(token!, userId!, _id);
                dispatch(addMessages(parsedMessages));
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (token && userId && _id) {
            getMessageHistory();
        }
    }, [userId, token, _id, dispatch]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        handleTyping();
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !socket) return;

        const messageData: MessageType = {
            sender: _id,
            receiver: userId!,
            message: message.trim(),
            timestamps: new Date().toISOString(),
        };

        try {
            if (socket.connected) {
                socket.emit('message', messageData);
                setMessage("");
                resetTyping();
            }

            dispatch(addMessage(messageData));
            await saveMessage(token!, messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!friendProfile) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col justify-between p-2">
            <ChatHeader
                friendProfile={friendProfile}
                onBackClick={() => navigate('/chats')}
                onMenuClick={() => alert(friendProfile.desc)}
            />

            <div className='w-full flex-1 overflow-y-auto no-scrollbar py-4'>
                <MessageList messages={messages} _id={_id} />
                <div ref={endOfMessagesRef} />
            </div>

            <MessageInput
                message={message}
                onChange={handleMessageChange}
                onSend={sendMessage}
            />
        </div>
    );
};

export default ChatWithFriend;
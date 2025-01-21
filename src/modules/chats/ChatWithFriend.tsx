import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { addMessage, addMessages } from '../../redux/slices/chatSlice';
import { useSocket } from '../../context/socketProvider';
import { MessageType, userType } from '../../types/user';
import { useTyping } from '../../hooks/useTyping';
import { getData, getMessage, saveMessage, uploadImage } from '../../utils/action';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/ui/MessageList';
import MessageInput from '../../components/chat/MessageInput';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ChatWithFriend = () => {
    const [friendProfile, setFriendProfile] = useState<userType | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const { userId } = useParams();
    const [imageLoader, setImageLoader] = useState(false);
    const navigate = useNavigate();
    const { messages } = useSelector((states: any) => states.chats);
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const { _id } = token ? jwtDecode<{ _id: string }>(token) : { _id: '' };

    const { handleTyping, resetTyping } = useTyping(socket, userId);


    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedImage = e.target.files[0];
            
            if (selectedImage && selectedImage.size > MAX_IMAGE_SIZE) {
                alert("File is too large! Please upload an image smaller than 5MB.");
                return;
            }

            setImage(selectedImage);
        }
    };

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
                console.log(parsedMessages);
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

        if (!socket) return;

        if (!message.trim() && !image) return;

        const messageData: MessageType = {
            sender: _id,
            receiver: userId!,
            message: message.trim(),
            type: image != null ? 'image' : 'text',
            image: null,
            timestamps: new Date().toISOString(),
        };

        // if user sending image
        if (image) {
            setImageLoader(true);
            const imageUrl = await uploadImage(token!, image);
            messageData.image = imageUrl;
            setImage(null)
        }

        try {
            dispatch(addMessage(messageData));
            socket.emit('message', messageData);

            setMessage("");
            resetTyping();
            setImageLoader(false);

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
        <div className="w-full h-full flex flex-col justify-between p-2 relative">
            <div className='w-full h-auto max-sm:absolute top-0 bg-white z-10 max-sm:p-2'>
                <ChatHeader
                    friendProfile={friendProfile}
                    onBackClick={() => navigate('/chats')}
                    onMenuClick={() => alert(friendProfile.desc)}
                />
            </div>
            <MessageList
                messages={messages}
                imageLoader={imageLoader}
                setImageLoader={setImageLoader}
                _id={_id}
            />
            <div className="w-full h-auto max-sm:px-3 max-sm:absolute bottom-0 bg-white z-10 ">
                <MessageInput
                    message={message}
                    onChange={handleMessageChange}
                    onSend={sendMessage}
                    selectedImage={image}
                    onImageSelect={handleImageSelect}
                    onRemoveImage={() => setImage(null)}
                />
            </div>
        </div>
    );
};

export default ChatWithFriend;
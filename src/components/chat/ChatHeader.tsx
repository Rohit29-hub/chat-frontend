import { ArrowLeft, MoreVerticalIcon } from 'lucide-react';
import { userType } from '../../types/user';
import { formatLastSeen } from '../../utils/dateFormat';
import { useFriendStatus } from '../../context/friendStatusProvider';

type ChatHeaderProps = {
    friendProfile: userType;
    onBackClick: () => void;
    onMenuClick: () => void;
}

const ChatHeader = ({ friendProfile, onBackClick, onMenuClick }: ChatHeaderProps) => {
    const {friendStatus: {userId, isTyping}} = useFriendStatus();

    console.log(friendProfile);

    return (
        <nav className='w-full pb-2 border-b flex items-center justify-between'>
            <div className='flex items-center gap-x-2'>
                <div className="md:hidden block cursor-pointer" onClick={onBackClick}>
                    <ArrowLeft size={24} />
                </div>
                <div className="relative">
                    <img 
                        className='w-12 h-12 rounded-full object-cover border-2 border-gray-200' 
                        src={friendProfile.img} 
                        alt={friendProfile.username} 
                    />
                    <span 
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            friendProfile.status === 'true' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                    />
                </div>
                <div>
                    <h1 className='text-xl font-medium'>{friendProfile.username}</h1>
                    <p className="text-sm text-gray-500">
                        {userId === friendProfile.user && isTyping ? 'Typing...' :
                        friendProfile.status === 'true' ? 'Online' :
                        friendProfile.lastSeen ? `Last seen ${formatLastSeen(friendProfile.lastSeen)}` : 
                        'Offline'}
                    </p>
                </div>
            </div>
            <div className='md:hidden block' onClick={onMenuClick}>
                <MoreVerticalIcon size={24} />
            </div>
        </nav>
    )
};

export default ChatHeader;

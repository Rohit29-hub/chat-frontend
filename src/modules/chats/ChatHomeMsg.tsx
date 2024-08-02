
import { MessageCircleMore } from 'lucide-react';
import { useSidebar } from '../../context/sideBarToggleProvider';

const ChatHomeMsg = () => {
    const {toggleSidebar} = useSidebar();
    return (
        <div className='flex justify-center items-center gap-y-2 rounded w-full h-full'>
            <div className="w-auto h-auto flex flex-col items-center gap-y-3">
                <MessageCircleMore size={100} />
                <h1 className="text-2xl ">Yours Messages</h1>
                <p className="text-gray-500">Send a message to start a chat.</p>
                <button type='button' onClick={toggleSidebar} className="px-3 py-2 rounded-md bg-blue-400 text-white text-sm">Send message</button>
            </div>
        </div>
    )
}

export default ChatHomeMsg
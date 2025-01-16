import { SmilePlus, Send } from 'lucide-react';
import { FormEvent } from 'react';

type MessageInputProps = {
    message: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: (e: FormEvent) => void;
}

const MessageInput = ({ message, onChange, onSend }: MessageInputProps) => (
    <div className='w-full h-12 flex items-center gap-x-3'>
        <div className='w-full h-full border flex items-center gap-x-4 px-4 rounded-2xl overflow-hidden bg-[#EFF6FC]'>
            <input 
                value={message} 
                onChange={onChange}
                onKeyPress={(e) => e.key === 'Enter' && onSend(e)}
                className='w-full h-full text-sm font-medium outline-none border-none bg-transparent' 
                type="text" 
                placeholder='Type your message here...' 
            />
            <div className="cursor-pointer">
                <SmilePlus size={24} color='black' />
            </div>
        </div>
        <button 
            onClick={onSend} 
            className='bg-[#6E00FF] hover:bg-[#5900CC] transition-colors flex-shrink-0 p-2 rounded-md flex items-center justify-center'
            disabled={!message.trim()}
        >
            <Send size={24} color='white' />
        </button>
    </div>
);

export default MessageInput;
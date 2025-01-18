import { SmilePlus, Send, Pin, X } from 'lucide-react';
import { FormEvent } from 'react';

type MessageInputProps = {
    message: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: (e: FormEvent) => void;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedImage: string | null;
    onRemoveImage: () => void;
}

const MessageInput = ({ message, onChange, onSend, onImageSelect, selectedImage, onRemoveImage }: MessageInputProps) => {
    const handlePinClick = () => {
        const inputElement = document.getElementById('image-input') as HTMLInputElement;
        if (inputElement) inputElement.click();
    };

    return (
        <div className='w-full relative'>
            {/* Show selected image preview and X icon to remove image */}
            {selectedImage && (
                <div className="absolute left-0 bottom-14 flex items-center gap-x-2">
                    <div className='relative'>
                        <img src={selectedImage} alt="Selected Image" className="w-20 h-20 object-cover rounded-lg" />
                        {/* X icon to remove the selected image */}
                        <button onClick={onRemoveImage} className="bg-white absolute -right-2 -top-2 rounded-full p-1">
                            <X size={16} color="black" />
                        </button>
                    </div>
                </div>
            )}

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
                    <button
                        onClick={handlePinClick}
                        className="cursor-pointer"
                    >
                        <Pin size={24} color='black' />
                    </button>
                    <div className="cursor-pointer">
                        <SmilePlus size={24} color='black' />
                    </div>
                </div>
                <button
                    onClick={onSend}
                    className='bg-[#6E00FF] hover:bg-[#5900CC] transition-colors flex-shrink-0 p-2 rounded-md flex items-center justify-center'
                    disabled={!message.trim() && !selectedImage}
                >
                    <Send size={24} color='white' />
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    id="image-input"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageSelect}
                />
            </div>
        </div>
    );
};

export default MessageInput;

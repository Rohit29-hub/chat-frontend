import React, { useEffect, useRef } from "react";
import { getTimeDifference } from "../../utils/helper";
import { MessageType } from "../../types/user";

interface MessageListProps {
    messages: MessageType[];
    imageLoader: boolean;
    setImageLoader: (state: boolean) => void; // Prop for managing the loader state
    _id: string;
}

const MessageList = React.memo(({ messages, imageLoader, setImageLoader, _id }: MessageListProps) => {
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages,imageLoader]);

    // Handle image loading state change
    const handleImageLoad = () => {
        setImageLoader(false); // Hide loader once image is loaded
    };

    const handleImageError = () => {
        setImageLoader(false); // Hide loader if there is an error loading the image
    };

    return (
        <div className="w-full flex-1 overflow-y-auto no-scrollbar py-14 md:py-4">
            {messages && messages.length > 0 ? (
                messages.map((msgDetails, key) => (
                    <div key={key} className={`w-full flex py-3 px-2 ${msgDetails.sender === _id ? 'justify-end' : 'justify-start'}`}>
                        <div>
                            <div className={`messageField ${msgDetails.sender === _id ? 'bg-[#6E00FF]' : 'bg-[#E7E7E7]'} rounded-2xl relative px-3 py-2 flex items-center justify-center`}>
                                {msgDetails.type === 'text' ? (
                                    <p className={`${msgDetails.sender === _id ? 'text-white' : 'text-black'} text-sm font-medium px-3 py-1`}>
                                        {msgDetails.message}
                                    </p>
                                ) : msgDetails.type === 'image' && msgDetails.image ? (
                                    <div className="relative">
                                        <img
                                            src={msgDetails.image}
                                            alt="Message Image"
                                            className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                                            onLoad={handleImageLoad} // Trigger once image is loaded
                                            onError={handleImageError} // Handle image load error
                                        />
                                        <p className={`${msgDetails.sender === _id ? 'text-white' : 'text-black'} text-sm font-medium px-3 py-1`}>
                                            {msgDetails.message}
                                        </p>
                                    </div>
                                ) : (
                                    <p className={`${msgDetails.sender === _id ? 'text-white' : 'text-black'} text-sm font-medium px-3 py-1`}>
                                        Image not available
                                    </p>
                                )}
                                <span
                                    className={`absolute bottom-0 inline-block p-1 rounded-full ${msgDetails.sender === _id ? 'bg-[#6E00FF] -right-2' : 'bg-[#E7E7E7] -left-2'}`}
                                ></span>
                            </div>
                            <p className='text-xs text-gray-400'>{getTimeDifference(msgDetails.timestamps)}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className='w-full h-full flex items-center justify-center'>
                    <p>No Message</p>
                </div>
            )}

            {/* Show loader card at the bottom of the chat if imageLoader is true */}
            {imageLoader && (
                <div className="w-full flex h-auto items-center justify-end">
                    <div className="max-w-[200px] max-h-[200px] w-44 h-44 mt-4 rounded-md inset-0 flex items-center justify-center bg-opacity-50 bg-gray-500">
                        <div className="w-6 h-6 border-4 border-t-4 border-blue-200 border-solid rounded-full animate-spin"></div>
                    </div>
                </div>
            )}

            <div ref={endOfMessagesRef} />
        </div>
    );
});

export default MessageList;

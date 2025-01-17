import React, { useEffect, useRef } from "react";
import { getTimeDifference } from "../../utils/helper";

type msgDetailsType = {
    message: string,
    receiver: string,
    sender: string,
    timestamps: string,
}

interface MessageListProps {
    messages: msgDetailsType[];
    _id: string;
}

const MessageList = React.memo(({ messages, _id }: MessageListProps) => {
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    return (
        <div className="w-full flex-1 overflow-y-auto no-scrollbar py-14 md:py-4">
            {messages && messages.length > 0 ? (
                messages.map((msgDetails, key) => (
                    <div key={key} className={`w-full flex py-3 px-2 ${msgDetails.sender === _id ? 'justify-end' : 'justify-start'}`}>
                        <div>
                            <div className={`messageField ${msgDetails.sender === _id ? 'bg-[#6E00FF]' : 'bg-[#E7E7E7]'} rounded-2xl relative px-3 py-2 flex items-center justify-center`}>
                                <p className={`${msgDetails.sender === _id ? 'text-white' : 'text-black'} text-sm font-medium px-3 py-1`}>
                                    {msgDetails.message}
                                </p>
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
            <div ref={endOfMessagesRef} />
        </div>
    );
});

export default MessageList;
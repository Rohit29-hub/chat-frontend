export type userType = {
    _id: string;
    user: string;
    username: string;
    img: string;
    desc: string;
    status: 'online' | 'offline' | 'typing';
    lastSeen?: string | Date;
}


export type MessageType = {
    sender: string;
    receiver: string;
    message: string;
    timestamps: string;
}

export type TypingData = {
    userId: string;
    isTyping: boolean;
}
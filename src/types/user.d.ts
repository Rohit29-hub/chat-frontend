export type userType = {
    _id: string;
    user: string;
    username: string;
    img: string;
    desc: string;
    status: 'true' | 'false';
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
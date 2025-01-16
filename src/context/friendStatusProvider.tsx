import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type friendStatusContextType = {
    friendStatus: {
        userId: string,
        isTyping: boolean
    }
    setFriendStatus: Dispatch<SetStateAction<{ userId: string; isTyping: boolean; }>>
};

const FriendStatusContext = createContext<friendStatusContextType | null>(null);

export const FriendStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [friendStatus,setFriendStatus] = useState<{userId: string,isTyping: boolean}>({
        userId: "",
        isTyping: false
    });

    return (
        <FriendStatusContext.Provider value={{ friendStatus,setFriendStatus }}>
            {children}
        </FriendStatusContext.Provider>
    );
};

export const useFriendStatus = () => {
    const context = useContext(FriendStatusContext);
    if (!context) {
        throw new Error("useFriendStatus must be used within a useFriendStatusProvider");
    }
    return context;
};

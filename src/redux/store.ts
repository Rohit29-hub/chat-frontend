import { configureStore } from "@reduxjs/toolkit";
import socketSlice from "./slices/socketSlice";
import chatSlice from "./slices/chatSlice";

export const store = configureStore({
    reducer: {
        socket: socketSlice,
        chats: chatSlice
    }
})
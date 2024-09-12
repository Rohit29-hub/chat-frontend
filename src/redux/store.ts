import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chatSlice";

export const store = configureStore({
    reducer: {
        chats: chatSlice
    }
})
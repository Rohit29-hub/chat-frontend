import { createSlice } from "@reduxjs/toolkit";
type messageType = {
    reciver: string,
    sender: string,
    message: {
        message: string
    }
    timestamps: string
}

type initialStateType = {
    messages: Array<messageType> | null,
}
const Chats = createSlice({
    name: 'chats',
    initialState: {
        messages: null
    } as initialStateType,
    reducers: {
        addMessage: (state, action) => {
            state.messages?.push(action.payload);
        },
        addMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
})

export const { addMessage,addMessages } = Chats.actions
export default Chats.reducer;
import { createSlice } from "@reduxjs/toolkit";

type messageType = {
    receiver: string,
    sender: string,
    message: string,
    type: 'image' | 'text',
    image: string | null,
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
            if (state.messages == null) {
                state.messages = [action.payload];
            } else {
                state.messages.push(action.payload);
            }
        },
        addMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
})

export const { addMessage, addMessages } = Chats.actions
export default Chats.reducer;

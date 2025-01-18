import { createSlice } from "@reduxjs/toolkit";
import { MessageType } from "../../types/user";

type initialStateType = {
    messages: Array<MessageType> | null,
}
const Chats = createSlice({
    name: 'chats',
    initialState: {
        messages: null
    } as initialStateType,
    reducers: {
        addMessage: (state, action) => {
            if(state.messages == null){
                state.messages = [action.payload];
            }else{
                state.messages.push(action.payload);
            }
        },
        addMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
})

export const { addMessage,addMessages } = Chats.actions
export default Chats.reducer;

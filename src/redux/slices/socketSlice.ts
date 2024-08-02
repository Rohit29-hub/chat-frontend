import { createSlice } from "@reduxjs/toolkit";
const Socket = createSlice({
    name: 'socket',
    initialState: {
        my_socket_id: null,
        my_socket: null,
    },
    reducers: {
        addSocket: (state, action) => {
            state.my_socket_id = action.payload.id;
            state.my_socket = action.payload;
        }
    }
})

export const {addSocket} = Socket.actions
export default Socket.reducer;
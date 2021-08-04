import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {User} from "../../../server/server";

const userSlice = createSlice({
    name: 'user',
    initialState: null as (User | null),
    reducers: {
        setUser: (_, action: PayloadAction<User>) => action.payload,
        clearUser: () => null
    }
})

export const {setUser, clearUser} = userSlice.actions
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer

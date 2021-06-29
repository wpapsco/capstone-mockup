
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

export type SnackbarState = {message: string, shown: boolean}

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState: {message: "", shown: false},
    reducers: {
        openSnackbar: (_, action: PayloadAction<string>) => ({message: action.payload, shown: true}),
        closeSnackbar: () => ({message: "", shown: false})
    }
})

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions
export const selectSnackbar = (state: RootState) => state.snackbar

export default snackbarSlice.reducer

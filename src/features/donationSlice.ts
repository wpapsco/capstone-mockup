import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

export type DonationSlice = {amount: number}

const donationSlice = createSlice({
    name: 'donation',
    initialState: {amount: 0},
    reducers: {
        setDonation: (_, action: PayloadAction<number>) => ({amount: action.payload})
    }
})

export const {setDonation} = donationSlice.actions
export const selectDonation = (state: RootState) => state.donation.amount

export default donationSlice.reducer

import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/admin/userSlice';
import eventsReducer from '../features/events/eventsSlice';
import snackbarReducer from '../features/snackbarSlice';
import ticketingReducer from '../features/ticketing/ticketingSlice';

const store = configureStore(
    {
        reducer: {
            events: eventsReducer,
            snackbar: snackbarReducer,
            ticketing: ticketingReducer,
            user: userSlice
        }
    },
);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

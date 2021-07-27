import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '../features/events/eventsSlice';
import snackbarReducer from '../features/snackbarSlice';
import ticketingReducer_v2 from '../features/ticketing/ticketingSlice';

const store = configureStore(
    {
        reducer: {
            events: eventsReducer,
            snackbar: snackbarReducer,
            ticketing: ticketingReducer_v2,
        }
    },
);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

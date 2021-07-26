import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/cart/cartSlice';
import eventsReducer from '../features/events/eventsSlice';
import snackbarReducer from '../features/snackbarSlice';
import ticketingReducer_v2 from '../features/ticketing/ticketingSlice';

const store = configureStore(
    {
        reducer: {
            shop: shopReducer,
            events: eventsReducer,
            snackbar: snackbarReducer,
            ticketing: ticketingReducer_v2,
        }
    },
);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {cart: CartState}
export type AppDispatch = typeof store.dispatch;

export default store;

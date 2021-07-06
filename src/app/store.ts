import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/cart/cartSlice';
import eventsReducer from '../features/events/eventsSlice';
import snackbarReducer from '../features/snackbarSlice';

const store = configureStore(
    {
        reducer: {
            shop: shopReducer,
            events: eventsReducer,
            snackbar: snackbarReducer
        }
    },
);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {cart: CartState}
export type AppDispatch = typeof store.dispatch;

export default store;

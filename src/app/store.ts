import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import eventsReducer from '../features/events/eventsSlice';

const store = configureStore(
    {
        reducer: {
            cart: cartReducer,
            events: eventsReducer
        }
    },
);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {cart: CartState}
export type AppDispatch = typeof store.dispatch;

export default store;
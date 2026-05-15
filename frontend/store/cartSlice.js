import { createSlice } from '@reduxjs/toolkit';
const initialState = { items: [], total: 0 };
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existing = state.items.find(i => i.productId === action.payload.productId);
            if (existing) {
                existing.quantity += action.payload.quantity;
            }
            else {
                state.items.push(action.payload);
            }
            state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },
        removeFromCart(state, action) {
            state.items = state.items.filter(i => i.productId !== action.payload);
            state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },
        updateQuantity(state, action) {
            const item = state.items.find(i => i.productId === action.payload.productId);
            if (item)
                item.quantity = action.payload.quantity;
            state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        },
        clearCart(state) { state.items = []; state.total = 0; },
    },
});
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

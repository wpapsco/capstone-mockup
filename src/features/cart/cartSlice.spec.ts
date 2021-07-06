import cartReducer, {
    ShopState,
    addItem,
    removeItem,
    editQty,
} from './cartSlice'

describe('Cart reducer', () => {
    const initialState: ShopState = {
        cart: [],
        donation: 0,
    }

    it('should handle initial state', () => {
        const result = cartReducer(undefined, { type: 'unknown' })
        expect(result).toEqual(initialState)
    });

    it('should handle adding an item', () => {
        expect(false).toBe(true)
    })

    it('should handle removing an item', () => {
        expect(false).toBe(true)
    })

    it('should handle editing item quantity', () => {
        expect(false).toBe(true)
    })
})
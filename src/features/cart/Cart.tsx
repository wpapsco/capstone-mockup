import { appSelector } from '../../app/hooks'
import { selectCartItems } from '../cart/cartSlice'

const Cart = () => {
    const items = appSelector(selectCartItems)
    const cartItems = items.map(item => (
        <div>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.quantity} x {item.unitPrice}</p>
        </div>
    ))

    const placeholder = <p>Nothing in your cart</p>

    return (
        <div>
            <h2>Cart</h2>
            {items.length>0 ? cartItems : placeholder}
        </div>
    )
}

export default Cart
import { appSelector } from '../../app/hooks'
import { selectCartContents } from './cartSlice'
import CartRow from './CartItem'
import { Typography } from '@material-ui/core'


const Cart = () => {
    const items = appSelector((state) => selectCartContents(state))
    const cartItems = items.map(item => <CartRow {...item} />)
    
    // TODO: Add better call to action for empty cart state
    return (
        <section>
            <Typography component='h1' variant='h3'>My Cart</Typography>
            {(cartItems.length > 0) ? cartItems : <p>Your cart is empty</p>}
        </section>
    )
}

export default Cart
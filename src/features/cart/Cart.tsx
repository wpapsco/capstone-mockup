import { appSelector } from '../../app/hooks'
import { selectCartContents } from './cartSlice'
import CartRow from './CartItem'
import { Divider, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { toDollarAmount } from '../../utils'

const useStyles = makeStyles(() =>
    createStyles({
        subtotalRow: {
            display: 'flex',
            alignItems: 'center',
            height: '3.5em',
            margin: '10px',
            paddingTop: '10px 15px',
        },
        subtotal: {
            marginLeft: 'auto',
        },
        cartContents: {
            margin: '30px 0',
        }
    })
)

const Cart = () => {
    const classes = useStyles()
    const items = appSelector(state => selectCartContents(state))
    const subtotal = appSelector(state => state.shop.cart.reduce(
        (subtot, item) => subtot + (item.unitPrice * item.qty),
        0
    ))
    const cartItems = items.map(item => <CartRow {...item} />)
    
    // TODO: Add better call to action for empty cart state
    return (
        <section>
            <div className={classes.cartContents}>
                <Typography component='h1' variant='h3'>My Cart</Typography>
                {(cartItems.length > 0) ?
                    cartItems :
                    <p>Your cart is empty</p>
                }
            </div>

            <Divider orientation='horizontal' />

            <div className={classes.subtotalRow}>
                <Typography component='h2' variant='h6'>Subtotal:</Typography>
                <Typography variant='body1' className={classes.subtotal}>{toDollarAmount(subtotal)}</Typography>
            </div>
        </section>
    )
}

export default Cart
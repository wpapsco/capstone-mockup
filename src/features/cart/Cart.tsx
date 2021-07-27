import { appSelector } from '../../app/hooks'
import CartRow from './CartItem'
import { Divider, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { toDollarAmount } from '../../utils'
import { selectCartContents } from '../ticketing/ticketingSlice'

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

type Item = {price: string, qty: number}
const itemCost = (item: Item) => Number.parseFloat(item.price) * item.qty
const subtotalReducer = (acc: number, item: Item) => acc + itemCost(item)

const Cart = () => {
    const classes = useStyles()
    const items = appSelector(selectCartContents)
    const subtotal = items.reduce(subtotalReducer, 0)
    
    return (
        <section>
            <div className={classes.cartContents}>
                <Typography component='h1' variant='h3'>My Cart</Typography>
                {(items.length > 0) ? items.map(data => <CartRow key={data.product_id} {...data} />) : <p>Cart Empty</p>}
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
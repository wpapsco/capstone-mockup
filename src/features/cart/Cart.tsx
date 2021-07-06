import { appSelector } from '../../app/hooks'
import { selectCartContents, CartItem } from './cartSlice'

import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { theme } from '../../theme'
import Button from '@material-ui/core/Button'

import { useState, useEffect } from 'react'

const toDollarAmount = (n: number): string => {
    return '$' + n.toFixed(2).toString()
}

const useStyles = makeStyles(() => 
    createStyles({
        cartItem: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 15px',
            margin: '10px 0',
        },
        itemDescriptors: {
            width: '33%',
        },
        qtyPicker: {
            fontSize: '1.2rem',
            border: 'none',
            margin: '1.2rem',
        },
    })
)

// TODO: quantity setter component
const CartRow = (props: CartItem) => {
    const classes = useStyles(theme)
    const [qty, setQty] = useState(props.qty)
    const [cost, setCost] = useState(props.unitPrice * qty)

    useEffect(() => {
        setCost(qty * props.unitPrice)
    }, [qty])
    
    return (
        <Paper elevation={1} className={classes.cartItem}>
            <span className={classes.itemDescriptors}>
                <h4>{props.name}</h4>
                <p>{props.description}</p>
            </span>

            <div className={classes.itemDescriptors}>
                <button onClick={() => setQty(qty - 1)}>-</button>
                <span className={classes.qtyPicker}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
            </div>

            {toDollarAmount(cost)}

            <Button>
                Remove
            </Button>
        </Paper>
    )
}

const Cart = () => {
    const items = appSelector((state) => selectCartContents(state))
    const cartItems = items.map(item => <CartRow {...item} />)
    
    // TODO: Add better call to action for empty cart state
    return (
        <section>
            <h1>My Cart</h1>
            {(cartItems.length > 0) ? cartItems : <p>Your cart is empty</p>}
        </section>
    )
}

export default Cart
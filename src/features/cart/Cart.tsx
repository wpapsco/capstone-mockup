import { appSelector } from '../../app/hooks'
import { selectCartItems } from '../cart/cartSlice'

import Paper from '@material-ui/core/Paper'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { theme } from '../../theme'
import Button from '@material-ui/core/Button'

import React, { useState, useEffect } from 'react'

const toDollarAmount = (n: number): string => {
    return '$' + n.toFixed(2).toString()
}

const useStyles = makeStyles((theme: Theme) => 
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
        qty: {
            fontSize: '1.2rem',
            border: 'none',
            margin: '1.2rem',
        },
    })
)

interface CartItemProps {
    name: string,
    description: string,
    unitPrice: number,
    quantity: number,
}
const CartItem = (props: CartItemProps) => {
    const classes = useStyles(theme)
    const [qty, setQty] = useState(props.quantity)
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
                <span className={classes.qty}>{qty}</span>
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
    const items = appSelector((state) => selectCartItems(state))
    const cartItems = items.map(item => <CartItem {...item} />)
    
    // TODO: Add better call to action for empty cart state
    return (
        <section>
            <h1>My Cart</h1>
            {(cartItems.length > 0) ? cartItems : <p>Your cart is empty</p>}
        </section>
    )
}

// const QuantityPicker = () => {
//     <React.Fragment>
//         <
//     </React.Fragment>
// }


export default Cart
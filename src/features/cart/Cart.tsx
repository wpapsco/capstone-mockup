import { appSelector } from '../../app/hooks'
import { selectCartItems } from '../cart/cartSlice'

import Paper from '@material-ui/core/Paper'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { theme } from '../../theme'

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
    desc: string,
    unitPrice: number,
    qty: number,
}
const CartItem = (props: CartItemProps) => {
    const classes = useStyles(theme)
    const [qty, setQty] = useState(1)
    const [cost, setCost] = useState(0)

    useEffect(() => {
        setCost(props.unitPrice * qty)
    }, [qty])

    return (
        <Paper elevation={1} className={classes.cartItem}>
            <span className={classes.itemDescriptors}>
                <h4>{props.name}</h4>
                <p>{props.desc}</p>
            </span>
            <div className={classes.itemDescriptors}>
                <button onClick={() => setQty(qty - 1)}>-</button>
                <span className={classes.qty}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            {toDollarAmount(cost)}
            <button>Remove</button>
        </Paper>
    )
}

const Cart = () => {
    const testData = [
        {
            name: 'Tickets for "A Christmas Carol"',
            desc: 'General admission',
            unitPrice: 15.99,
            qty: 1,
        }, {
            name: 'Tickets for "A Christmas Carol"',
            desc: 'General admission',
            unitPrice: 15.99,
            qty: 1,
        }
    ]

    const cartItems = testData.map(item => <CartItem {...item} />)
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
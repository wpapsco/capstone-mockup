import { useEffect, useState } from 'react'
import { appSelector } from '../../app/hooks'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button'
// import { selectDonation } from './cartSlice'
import CartItemRow from './CartItem'
import { selectCartContents } from '../ticketing/ticketingSlice'
import { CartItem } from '../ticketing/ticketingTypes'

const toDollar = (x: number) => `$${(Math.round(x * 100) / 100).toFixed(2)}`

const toCartItemRow = (data: CartItem) => <CartItemRow {...data} />
const YourOrder = () => {
    const cartItems = appSelector(selectCartContents)
    // const donation = appSelector(selectDonation)
    const [subtotal, setSubtotal] = useState(0)

    useEffect(() => {
        setSubtotal(
            cartItems.reduce((tot, curItem) => tot + (curItem.qty * curItem.price), 0)
        )
    }, [cartItems])

    const contents = (cartItems.length > 0) ? cartItems.map(toCartItemRow)
        : <p>Cart empty</p>
        
    return (
        <Paper style={{minWidth: "20%", flexGrow: 2, height: "100%", margin: "10px", paddingLeft: "2%", paddingRight: "2%", paddingTop: "50px"}} variant="outlined">
            <Typography variant="h4">Your order</Typography>
            {contents}

            <Button color="primary" variant="contained" style={{width: "100%"}}>Add more items</Button>
            <Divider style={{marginBottom: "30px", marginTop: "30px"}}/>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body2" color="textSecondary">{toDollar(subtotal)}</Typography>
            </div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2">Discount</Typography>
                <Typography variant="body2" color="textSecondary">-$X.XX</Typography>
            </div>
            {/* <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2">Donation</Typography>
                <Typography variant="body2" color="textSecondary">{toDollar(donation)}</Typography>
            </div> */}
            <Divider style={{marginBottom: "30px", marginTop: "30px"}}/>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body1">Total</Typography>
                {/* <Typography variant="body1" color="textSecondary">{toDollar(donation+subtotal)}</Typography> */}
                <Typography variant="body1" color="textSecondary">{toDollar(subtotal)}</Typography>
            </div>
        </Paper>
    )
}

export default YourOrder

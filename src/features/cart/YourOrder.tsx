import { useEffect, useState } from 'react'
import { appSelector } from '../../app/hooks'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button'
import { selectCartContents, selectDonation } from './cartSlice'
import CartItemRow from './CartItem'
import {makeStyles} from '@material-ui/core';

const toDollar = (x: number) => `$${(Math.round(x * 100) / 100).toFixed(2)}`

const useStyles = makeStyles({
    paper: {minWidth: "20%", flexGrow: 2, height: "100%", margin: "10px", paddingLeft: "2%", paddingRight: "2%", paddingTop: "30px"},
    subtotal: {display: "flex", justifyContent: "space-between"},
    divider: {marginBottom: "30px", marginTop: "30px"},
})

const YourOrder = () => {
    const cartItems = appSelector(selectCartContents)
    const donation = appSelector(selectDonation)
    const [subtotal, setSubtotal] = useState(0)
    const classes = useStyles()

    useEffect(() => {
        setSubtotal(
            cartItems.reduce((tot, curItem) => tot += curItem.qty * curItem.unitPrice, 0)
        )
    }, [cartItems])

    const contents = (cartItems.length > 0) ? cartItems.map(data => <CartItemRow {...data} />)
        : <p>Cart empty</p>
        
    return (
        <Paper className={classes.paper} variant="outlined">
            <Typography variant="h4">Your order</Typography>
            {contents}

            <Button color="primary" variant="contained" fullWidth>Add more items</Button>
            <Divider className={classes.divider}/>
            <div className={classes.subtotal}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body2" color="textSecondary">{toDollar(subtotal)}</Typography>
            </div>
            <div className={classes.subtotal}>
                <Typography variant="body2">Discount</Typography>
                <Typography variant="body2" color="textSecondary">-$X.XX</Typography>
            </div>
            <div className={classes.subtotal}>
                <Typography variant="body2">Donation</Typography>
                <Typography variant="body2" color="textSecondary">{toDollar(donation)}</Typography>
            </div>
            <Divider className={classes.divider}/>
            <div className={classes.subtotal}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1" color="textSecondary">{toDollar(donation+subtotal)}</Typography>
            </div>
        </Paper>
    )
}

export default YourOrder

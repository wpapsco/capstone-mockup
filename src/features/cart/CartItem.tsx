import { CartItem } from './cartSlice'
import Typography from '@material-ui/core/Typography'

const CartItemRow = (props: CartItem) => {
    return (
        <div style={{paddingBottom: "10px"}}>
            <Typography variant="body1" color="textPrimary">{props.name}</Typography>
            <Typography variant="body2" color="textSecondary">{props.description}</Typography>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2" color="textSecondary">Quantity: {props.qty}</Typography>
                <Typography variant="body2" color="textSecondary">${props.unitPrice}</Typography>
            </div>
        </div>
    )
}

export default CartItemRow
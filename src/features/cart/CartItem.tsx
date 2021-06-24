import Typography from '@material-ui/core/Typography'

export type CartItemProps = { name: string, description: string, quantity: number, unitPrice: number }
const CartItem = (props: CartItemProps) => {
    return (
        <div style={{paddingBottom: "10px"}}>
            <Typography variant="body1" color="textPrimary">{props.name}</Typography>
            <Typography variant="body2" color="textSecondary">{props.description}</Typography>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography variant="body2" color="textSecondary">Quantity: {props.quantity}</Typography>
                <Typography variant="body2" color="textSecondary">${props.unitPrice}</Typography>
            </div>
        </div>
    )
}

export default CartItem
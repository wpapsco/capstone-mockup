import { useState, useEffect } from 'react'
import { CartItem } from '../ticketing/ticketingTypes'
import { editItemQty, removeTicketFromCart } from '../ticketing/ticketingSlice'
import { useAppDispatch } from '../../app/hooks'
import { Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import theme from '../../theme'
import { toDollarAmount } from '../../utils'

const useStyles = makeStyles(() => 
    createStyles({
        cartItem: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            margin: '15px',
        },
        image: {
            width: '100px',
            borderRadius: '3px',
            marginRight: '15px',
        },
        itemDescriptors: {
            width: '43%',
            color: 'rgb(64, 88, 96)',
        },
        itemName: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
        },
        qtyPicker: {
            fontSize: '1.2rem',
            border: 'none',
            margin: '1.2rem',
        },
    })
)

// TODO: Display show time
// TODO: Display concession ticket & its price
// TODO: do not allow purchase qty > available seats
const CartRow = (props: CartItem) => {
    const dispatch = useAppDispatch()
    const classes = useStyles(theme)
    const price = Number.parseFloat(props.price)

    const [cost, setCost] = useState(price * props.qty)

    useEffect(() => {
        setCost(props.qty * price)
    }, [props.qty])

    const decrement = () => {
        if (props.qty > 0) {
            dispatch(editItemQty({id: props.product_id, qty: props.qty-1}))
        }
    }

    return (
        <Paper elevation={1} className={classes.cartItem}>
            <img src={props.product_img_url} className={classes.image} alt='foo'/>
            <span className={classes.itemDescriptors}>
                <Typography
                    component='h2'
                    variant="body1"
                    color="textPrimary"
                    className={classes.itemName}
                >
                    {props.name}
                </Typography>
                <p>{props.desc}</p>
            </span>

            <div className={classes.itemDescriptors}>
                <RemoveOutlinedIcon onClick={decrement}></RemoveOutlinedIcon>
                <span className={classes.qtyPicker}>{props.qty}</span>
                <AddOutlinedIcon
                    onClick={() => dispatch(editItemQty({id: props.product_id, qty: props.qty+1}))}>
                </AddOutlinedIcon>
            </div>

            {toDollarAmount(cost)}

            <CloseOutlinedIcon onClick={() => dispatch(removeTicketFromCart(props.product_id))}> </CloseOutlinedIcon>
        </Paper>
    )
}

export default CartRow
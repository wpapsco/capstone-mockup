import { useState, useEffect } from 'react'
import { CartItem } from '../ticketing/ticketingTypes'
import { editQty, removeItem } from './cartSlice'
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
            padding: '15px 30px',
            margin: '15px',
        },
        image: {
            width: '100px',
            height: '100%',
            borderRadius: '5px',
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

// TODO: Add product image
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

    const handleDecrement = () => {
        if (props.qty > 0) {
            dispatch(editQty({id: props.product_id, qty: props.qty-1}))
        }
    }
    
    return (
        <Paper elevation={1} className={classes.cartItem}>
            <img src={props.product_img_url} className={classes.image} alt='foo'/>
            <span className={classes.itemDescriptors}>
                <Typography component='h2' variant="h5" color="textPrimary">{props.name}</Typography>
                <p>{props.desc}</p>
            </span>

            <div className={classes.itemDescriptors}>
                <RemoveOutlinedIcon onClick={handleDecrement}></RemoveOutlinedIcon>
                <span className={classes.qtyPicker}>{props.qty}</span>
                <AddOutlinedIcon onClick={() => dispatch(editQty({id: props.product_id, qty: props.qty+1}))}></AddOutlinedIcon>
            </div>

            {toDollarAmount(cost)}

            <CloseOutlinedIcon onClick={() => dispatch(removeItem(props.product_id))}> </CloseOutlinedIcon>
        </Paper>
    )
}

export default CartRow
import { useState, useEffect } from 'react'
import { CartItem } from '../ticketing/ticketingTypes'
import { editItemQty, removeTicketFromCart } from '../ticketing/ticketingSlice'
import { useAppDispatch } from '../../app/hooks'
import { Button, Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import theme from '../../theme'
import { toDollarAmount } from '../../utils'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(() => 
    createStyles({
        cartItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 30px',
            margin: '15px',
        },
        image: {
            width: '150px',
            borderRadius: '3px',
        },
        itemDescriptors: {
            width: '250px',
            color: 'rgb(64, 88, 96)',
        },
        itemName: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
        },
        qtyValue: {
            fontSize: '1.2rem',
            border: 'none',
            margin: '1.2rem',
        },
        qtyPicker: {
            width: '100px',
            display: 'flex',
            alignItems: 'center',
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalContent: {
            padding: '15px',
        },
        btnGroup: {
            display: 'flex',
            margin: '10px auto',
            justifyContent: 'space-around',
        }
    })
)

// TODO: do not allow purchase qty > available seats
const CartRow = (props: CartItem) => {
    const dispatch = useAppDispatch()
    const classes = useStyles(theme)
    const [cost, setCost] = useState(props.price * props.qty)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => setCost(props.qty * props.price), [props.qty])

    const decrement = () => {
        if (props.qty > 1) {
            dispatch(editItemQty({id: props.product_id, qty: props.qty-1}))
        } else {
            setModalOpen(true)
        }
    }

    const handleRemove = () => {
        setModalOpen(false)
        dispatch(removeTicketFromCart(props.product_id))
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

            <div className={classes.qtyPicker}>
                <RemoveOutlinedIcon onClick={decrement}></RemoveOutlinedIcon>
                <span className={classes.qtyValue}>{props.qty}</span>
                <AddOutlinedIcon
                    onClick={() => dispatch(editItemQty({id: props.product_id, qty: props.qty+1}))}>
                </AddOutlinedIcon>
            </div>

            {toDollarAmount(cost)}

            <CloseOutlinedIcon onClick={() => setModalOpen(true)}> </CloseOutlinedIcon>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, }}
            >
                <Fade in={modalOpen}>
                    <Paper className={classes.modalContent}>
                        <p>Do you want to remove this from your cart?</p>
                        <div className={classes.btnGroup}>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button variant="contained" color="secondary" onClick={handleRemove}>Yes, remove</Button>
                        </div>
                    </Paper>
                </Fade>
            </Modal>
        </Paper>
    )
}

export default CartRow
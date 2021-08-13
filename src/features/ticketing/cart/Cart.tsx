import { useState } from 'react'
import { appSelector, useAppDispatch } from '../../../app/hooks'
import CartRow from './CartItem'
import { Backdrop, Button, Divider, Fade, Modal, Paper, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { toDollarAmount } from '../../../utils'
import { removeTicketFromCart, selectCartContents } from '../ticketingSlice'
import { useHistory } from "react-router-dom";
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles(() =>
    createStyles({
        subtotalRow: {
            display: 'flex',
            alignItems: 'center',
            height: '3.5em',
            margin: '10px',
            paddingTop: '10px 15px',
        },
        subtotal: {
            marginLeft: 'auto',
        },
        cartContents: {
            margin: '30px 0',
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
        },
    })
)

type Item = {price: number, qty: number}
const itemCost = (item: Item) => item.price * item.qty
const subtotalReducer = (acc: number, item: Item) => acc + itemCost(item)

const Cart = () => {
    const history = useHistory();

    const dispatch = useAppDispatch()
    const classes = useStyles()
    const items = appSelector(selectCartContents)
    const subtotal = items.reduce(subtotalReducer, 0)
    const [modalOpen, setModalOpen] = useState(false)
    const [targetItem, setTargetItem] = useState<number|null>(null)
    
    const resetModal = () => {
        setTargetItem(null)
        setModalOpen(false)
    }

    const handleRemove = () => {
        if (targetItem) {
            dispatch(removeTicketFromCart(targetItem))
            resetModal()
        }
    }

    const displayModal = (id: number) => {
        setTargetItem(id)
        setModalOpen(true)
    }

    const navigateToCompleteOrder = () => {
        history.push("/completeorder");
    }
    
    return (
        <section>
            <div className={classes.cartContents}>
                <Typography component='h1' variant='h3'>My Cart</Typography>
                {(items.length > 0)
                    ? items.map(data => <CartRow key={data.product_id} item={data} removeHandler={displayModal} />)
                    : <p>Cart Empty</p>
                }
            </div>

            <Divider orientation='horizontal' />

            <div className={classes.subtotalRow}>
                <Typography component='h2' variant='h6'>Subtotal:</Typography>
                <Typography variant='body1' className={classes.subtotal}>{toDollarAmount(subtotal)}</Typography>
            </div>

            <div>
                <Button variant="contained" color="primary" disabled={items.length === 0} onClick={navigateToCompleteOrder}>Complete Order</Button>
            </div>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className={classes.modal}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, }}
            >
                <Fade in={modalOpen}>
                    <Paper className={classes.modalContent}>
                        <Typography variant='h6' align='center' component='h2' id='modal-title'>Confirm removal</Typography>
                        <p id='modal-description'>Do you want to remove this from your cart?</p>
                        <div className={classes.btnGroup}>
                            <Button variant="outlined" onClick={resetModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleRemove}>
                                Yes, remove
                            </Button>
                        </div>
                    </Paper>
                </Fade>
            </Modal>
        </section>
    )
}

export default Cart
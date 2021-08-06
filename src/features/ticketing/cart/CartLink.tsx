import { NavLink } from 'react-router-dom'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { makeStyles, Theme } from '@material-ui/core'
import { selectNumInCart } from '../ticketingSlice'
import { appSelector } from '../../../app/hooks'

const CartLink = () => {
    const classes = useStyles()
    const itemCount = appSelector(selectNumInCart)
    return (
        <NavLink to="/cart" className={classes.root}>
            <ShoppingCartIcon />
            Cart
            {(itemCount > 0) && <span className={classes.itemCount}>{itemCount}</span>}
        </NavLink>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        textDecoration: 'none',
        alignItems: 'center',
        color: theme.palette.text.primary,
    },
    itemCount: {
        background: theme.palette.primary.main,
        borderRadius: '8px',
        width: '10px',
        textAlign: 'center',
        padding: '3px 5px',
        margin: theme.spacing(0.5),
        color: 'white',
        fontWeight: 600
    }
}))

export default CartLink


import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { theme } from '../theme'

import { NavLink } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '30px',
        },
        // link: {
        //     '&::visited': {
        //         color: 'grey'
        //     }
        // },
    })
)


// TODO: Create shopping cart icon component (with number of items in cart)
// TODO: Remove visited link color from shopping cart icon
export default function Navbar()  {
    const classes = useStyles(theme)

    return (
        <Paper square className={classes.navbar}>
            <Tabs>
                <Tab label="Doorlist" component={NavLink} to="/" />
                <Tab label="Events" component={NavLink} to="/events" />
                <Tab label="Complete Order" component={NavLink} to="/completeorder" />
                <Tab label="Create Events" component={NavLink} to="/CreateEvents" />
            </Tabs>
            <NavLink to="/cart"><ShoppingCartIcon /></NavLink>
        </Paper>
    )
}


import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import theme from '../theme'
import CartIconLink from '../features/ticketing/cart/CartLink'
import { NavLink, useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '30px',
            marginBottom: '30px',
        },
    })
)

export default function Navbar()  {
    const classes = useStyles(theme)
    const location = useLocation()
    const [_, tabname] = location.pathname.split('/')
    let currtab = 0;
    if (tabname) {
        currtab = {
            "events": 0,
            "completeorder": 1,
            "admin": 2,
            "login": 2,
            "donate": 3,
        }[tabname] || 0
    }

    return (
        <Paper square className={classes.navbar}>
            <Tabs value={currtab}>
                <Tab label="Events" component={NavLink} to="/events" />
                <Tab label="Complete Order" component={NavLink} to="/completeorder"/>
                <Tab label="Admin" component={NavLink} to="/admin" />
                <Tab label="Donate" component={NavLink} to="/donate" />
            </Tabs>
            <CartIconLink />
        </Paper>
    )
}


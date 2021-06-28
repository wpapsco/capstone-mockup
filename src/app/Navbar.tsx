import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { NavLink } from 'react-router-dom'

export default function Navbar()  {
    return (
        <Paper square>
            <Tabs>
                <Tab label="Doorlist" component={NavLink} to="/" />
                <Tab label="Events" component={NavLink} to="/events" />
                <Tab label="Complete Order" component={NavLink} to="/completeorder"/>
                <Tab label="Create Events" component={NavLink} to="/CreateEvents"/>
            </Tabs>
        </Paper>
)
}

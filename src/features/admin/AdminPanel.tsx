import { Grid, Card, Button } from "@material-ui/core";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import AssessmentIcon from '@material-ui/icons/Assessment';
import { AddBox, ExitToApp, VpnKey } from "@material-ui/icons";
import ViewListIcon from "@material-ui/icons/ViewList";
import { DeleteForever } from "@material-ui/icons";
import { ConfirmationNumber } from "@material-ui/icons";
import PeopleIcon from "@material-ui/icons/People";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EventIcon from '@material-ui/icons/Event';
import CreateIcon from '@material-ui/icons/Create';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { Typography } from "@material-ui/core";
import {NavLink, useHistory} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {openSnackbar} from "../snackbarSlice";
import {ReactNode} from 'react';

const useStyles = makeStyles({
    root: {
        
    },
    title: {
        fontSize: 24,
        display: "flex",
        padding: "7px"
    },
    card: {
        display: "inline-flex",
    },
    icon: {
        position: "relative",
    }
});

const LinkTo = (path: string) => (props: any) => 
    <NavLink to={path} {...props} />
    

export default function AdminPanel() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useAppDispatch()

    const onLogout = async () => {
        await fetch('/logout', {credentials: "include"})
        dispatch(openSnackbar("Logged out"))
        history.push("/")
    }

    type PanelProps = {
        title: string,
        icon: ReactNode
        buttons: {
            text: string,
            icon: ReactNode,
            link?: string,
            onClick?: () => void
        }[]
    }
    const Panel = (props: PanelProps) => 
        <Card variant="outlined" >
            <Typography className={ classes.title } >
                {props.icon}
                {props.title}
            </Typography>
            <List>
                {props.buttons.map(e => {
                    const compProps = e.link ? {component: LinkTo(e.link)} : e.onClick ? {onClick: e.onClick} : {}
                    return <ListItem button {...compProps}>
                        <ListItemIcon>
                            {e.icon}
                        </ListItemIcon>
                        <ListItemText primary={e.text}/>
                    </ListItem>
                }
                )}
            </List>
        </Card>

    return (
        <>
        <h1>Admin Panel</h1>
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
                <Panel title="Reports" icon={<AssessmentIcon fontSize="large" className={classes.icon}/>} buttons={[{
                    text: "Donations",
                    icon: <MonetizationOnIcon />
                }, {
                    text: "Ticket sales",
                    icon: <ConfirmationNumber />
                }, {
                    text: "Users",
                    icon: <PeopleIcon /> 
                }, {
                    text: "More",
                    icon: <MoreHorizIcon />
                }]} />
            </Grid>
            <Grid item xs={6}>
                <Panel title="Events" icon={<EventIcon fontSize="large" className={ classes.icon }/>} buttons={[{
                    link: "/admin/CreateEvents",
                    text: "Create an event",
                    icon: <AddBox />
                }, {
                    link: "/admin/DeleteEvents",
                    text: "Delete an event",
                    icon: <DeleteForever />
                }, {
                    link: "/events",
                    text: "View events",
                    icon: <ViewListIcon />
                }, {
                    link: "/admin/doorlist",
                    text: "Door list",
                    icon: <MeetingRoomIcon />
                }, 
                // {
                //     link: "",
                //     text: "More",
                //     icon: <MoreHorizIcon />
                // }
                ]} />
            </Grid>
            <Grid item xs={6}>
                <Panel title="Events" icon={<EventIcon fontSize="large" className={ classes.icon }/>} buttons={[{
                    link: "/admin/newsletter_create",
                    text: "Create newsletter",
                    icon: <AddBox />
                }]} />
            </Grid>
            <Grid item xs={6}>
                <Panel title="Accounts" icon={<AccountBoxIcon fontSize="large" className={classes.icon}/>} buttons={[{
                    link: "/admin/changePassword",
                    text: "Change admin password",
                    icon: <VpnKey />
                }, {
                    onClick: onLogout,
                    text: "Logout",
                    icon: <ExitToApp />
                }]} />
            </Grid>
        </Grid>
    </>
  );
}

/* All features here should have an administrator login required */

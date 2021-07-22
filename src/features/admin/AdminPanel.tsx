import { Grid, Card } from "@material-ui/core";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import AssessmentIcon from '@material-ui/icons/Assessment';
import { AddBox } from "@material-ui/icons";
import ViewListIcon from "@material-ui/icons/ViewList";
import { DeleteForever } from "@material-ui/icons";
import { ConfirmationNumber } from "@material-ui/icons";
import PeopleIcon from "@material-ui/icons/People";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import EventIcon from '@material-ui/icons/Event';
import CreateIcon from '@material-ui/icons/Create';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { Typography } from "@material-ui/core";

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


export default function AdminPanel() {
    const classes = useStyles();

    return (
        <>
        <h1>Admin Panel</h1>
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
                <Card variant="outlined" >
                    <Typography className={ classes.title } >
                        <AssessmentIcon fontSize="large" className={ classes.icon }/>
                        Reports
                    </Typography>
                    <List>
                        <ListItem button>
                            <ListItemIcon>
                                <MonetizationOnIcon />
                            </ListItemIcon>
                            <ListItemText primary="Donations" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <ConfirmationNumber />
                            </ListItemIcon>
                            <ListItemText primary="Ticket sales" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                            <PeopleIcon /> 
                            </ListItemIcon>
                            <ListItemText primary="Users" /> 
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <MoreHorizIcon />
                            </ListItemIcon>
                            <ListItemText primary="More" />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <Typography className={ classes.title } >
                        <EventIcon fontSize="large" className={ classes.icon }/>
                        Events 
                    </Typography>
                    <List>
                        <ListItem button component="a" href="/admin/CreateEvents">
                            <ListItemIcon>
                                <AddBox />
                            </ListItemIcon>
                            <ListItemText primary="Create an event" />
                        </ListItem>
                        <ListItem button component="a" href="/admin/DeleteEvents">
                            <ListItemIcon>
                                <DeleteForever />
                            </ListItemIcon>
                            <ListItemText primary="Delete an event" />
                        </ListItem>
                        <ListItem button component="a" href="/events" >
                            <ListItemIcon>
                                <ViewListIcon />
                            </ListItemIcon>
                            <ListItemText primary="View events" />
                        </ListItem>
                        <ListItem button component="a" href="/admin/doorlist">
                            <ListItemIcon>
                                <MeetingRoomIcon />
                            </ListItemIcon>
                            <ListItemText primary="Door list" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <MoreHorizIcon />
                            </ListItemIcon>
                            <ListItemText primary="More" />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card variant="outlined">
                    <Typography className={ classes.title } >
                        <CreateIcon fontSize="large" className={ classes.icon } />
                        Newsletter
                    </Typography>
                    <List>
                        <ListItem button component="a" href="/admin/newsletter_create">
                            <ListItemIcon>
                                <AddBox />
                            </ListItemIcon>
                            <ListItemText primary="Create newsletter" />
                        </ListItem>
                    </List>
                </Card>
            </Grid>
        </Grid>
    </>
  );
}

/* All features here should have an administrator login required */

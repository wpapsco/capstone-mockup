import {List, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import {useState} from "react";
import {Ticket} from '../ticketing/ticketingTypes'
import format from "date-fns/format";

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflow: "auto",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        '& .MuiListItem-root': {
            textAlign: 'center'
        }
    }
})

interface ShowtimeSelectProps {showings: Ticket[], showingSelected?: (dateShowing: Ticket) => void}
export default function ShowtimeSelect(props: ShowtimeSelectProps) {
    
    const [selectedId, setSelectedId] = useState(-1)
    const handleClick = (showtime: Ticket) => () => {
        setSelectedId(showtime.eventid)
        if (props.showingSelected) props.showingSelected(showtime)
    }
    const classes = useStyles()
    
    return (
        <List component="nav" className={classes.root}>
            {props.showings.map(s => 
                <ListItem key={s.eventid} button alignItems="flex-start" selected={s.eventid===selectedId} onClick={handleClick(s)}>
                    <ListItemText primary={format(s.date, "h:mm a")}/>
                </ListItem>
            )}
        </List>
    )
}


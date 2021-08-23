import {List, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import {useState} from "react";
import {Ticket} from '../ticketing/ticketingSlice'
import format from "date-fns/format";

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflow: "auto",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        '& .MuiListItem-root': {
            textAlign: 'center'
        }
    }
})

interface EventInstanceSelectProps {eventInstances: Ticket[], eventInstanceSelected?: (dateShowing: Ticket) => void}
export default function EventInstanceSelect(props: EventInstanceSelectProps) {
    
    const [selectedId, setSelectedId] = useState(-1)
    const handleClick = (eventInstance: Ticket) => () => {
        setSelectedId(eventInstance.event_instance_id)
        if (props.eventInstanceSelected) props.eventInstanceSelected(eventInstance)
    }
    const classes = useStyles()
    
    return (
        <List component="nav" className={classes.root}>
            {props.eventInstances.map(s => 
                <ListItem key={s.event_instance_id} button alignItems="flex-start" selected={s.event_instance_id===selectedId} onClick={handleClick(s)}>
                    <ListItemText primary={format(s.date, "h:mm a")}/>
                </ListItem>
            )}
        </List>
    )
}


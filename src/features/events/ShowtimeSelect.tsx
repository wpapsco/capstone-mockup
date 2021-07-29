import {List, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import {useState} from "react";
import format from "date-fns/format";

const useStyles = makeStyles({
    root: {
        height: "250px",
        minWidth: "8em",
        overflow: "auto"
    }
})

type DateShowing = {id: number, date: Date}
export default function ShowtimeSelect(props: {showings: DateShowing[], showingSelected?: (dateShowing: DateShowing) => void}) {
    
    const [selectedId, setSelectedId] = useState(-1)
    const handleClick = (showtime: DateShowing) => () => {
        setSelectedId(showtime.id)
        if (props.showingSelected) props.showingSelected(showtime)
    }
    const classes = useStyles()
    
    return <> 
        <List component="nav" className={classes.root}>
            {props.showings.map(s => 
                <ListItem button selected={s.id === selectedId} onClick={handleClick(s)}>
                    <ListItemText primary={format(s.date, "h:mm a")}/>
                </ListItem>
            )}
        </List>
    </>
}

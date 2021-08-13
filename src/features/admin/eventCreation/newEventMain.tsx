import { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import EventTimes from "./eventTimes";
import NewEvent from "./createEvent";
//import Event from '../../events/eventsSlice'; Why doesn't this work??

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(2),
            minWidth: 200,
        }
    })
);

interface PlayListings {
    name: string,
    id: number,
}

interface EventDetails {
    id: number,
    playid: number,
    showid: number,
    eventName: string,
    eventDate: Date,
    eventTime: string,
    seats: number,
    price: number,
}

/* TODO: 
    - Francis '/api/play-list' needs to return id's as well 
    - There should be no play with an id of 0    
*/

export default function NewEventMain() {
    const classes = useStyles();
    const [eventIndex, setEventIndex] = useState<number>(0);
    // "New" should always be the first value, set in useEffect
    const [eventTitles, setEventTitles] = useState<PlayListings[]>([]);
    const [eventDetails, setEventDetails] = useState<EventDetails[]>([]);

    useEffect(() => {
        fetch('/api/play-list')
            .then(response => response.json())
            .then(data => {
                let val: PlayListings[] = [{ name: 'New', id: 0 }];
                console.log(data);
                data.forEach((x: any) => {
                    val.push({ name: x.playname, id: x.id });
                })
                setEventTitles(val);
            })
    }, [setEventTitles, eventDetails])

    /* Prop passed down to createEvent. When an event is saved, we store the
       values and pass them along to eventTimes */
    const onEventSaved = (title: string, marquee: string[], description: string) => {
       // I think this should call the server to get a UUID and store the information
       // about the play.
       console.log('Play Name: ' + title);
       let titles = eventTitles.slice();
       titles.push({ name: title, id: 100 }); // TODO we should get a UUID for this
       setEventTitles(titles);
       setEventIndex(eventTitles.length); 
    }

    /* Handler for the select event */
    const onInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setEventIndex(event.target.value as number);
        let rows: EventDetails[] = [];
        fetch(`/api/show-tickets?play=${eventTitles[event.target.value as number].id}`)
            .then(request => request.json())
            .then(data => {
                console.log(data.rows);
                data.rows.forEach((val: any, index: number) => {
                    rows.push({
                        id: index,
                        playid: val.play_id,
                        showid: val.show_id,
                        eventName: val.playname,
                        eventDate: new Date(val.eventdate),
                        eventTime: val.starttime.slice(0, 5),
                        seats: val.availableseats,
                        price: val.price,
                    })
                })
            })
            setEventDetails(rows);
            console.log(rows);
    }

    return (
        <div>
            <h3>Create or edit an event</h3>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel>Options</InputLabel>
                    <Select
                        onChange={onInputChange}
                        value={ eventIndex}
                        defaultValue=""
                    >
                        {
                            eventTitles.map((val, index) => {
                                return(
                                    <MenuItem key={ index } value={ index }>{ val.name }</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            {
                // If the index is 0, then we have a new event, show the event creation page (createEvent) or if the
                // value is something else, we can edit the events show times (eventTimes).
                eventIndex === 0 ? <NewEvent eventSaved={onEventSaved} /> : <EventTimes eventTitle={eventTitles[eventIndex].name} eventDetails={eventDetails} />
            }            
        </div>
    )
}
import React, {useState} from 'react'
import {isSameDay} from "../../utils";
import {useAppDispatch, appSelector} from '../../app/hooks'
import {useParams} from 'react-router-dom'
import {selectEventData, Showing} from './eventsSlice'
import { addTicket } from '../cart/cartSlice'
import eventPageStyles from './eventPageStyles'
import format from "date-fns/format";
import {
    Card,
    CardMedia,
    CardContent,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from '@material-ui/core';
import {openSnackbar} from '../snackbarSlice'
import {titleCase, dayMonthDate, militaryToCivilian} from '../../utils'
import MultiSelectCalendar from '../../components/MultiSelectCalendar'
import ShowtimeSelect from './ShowtimeSelect';

type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    const [amount, setAmount] = useState(0)
    const [selectedShowing, setSelectedShowing] = useState<(Showing & {date: Date} | null)>(null)
    const [concessions, setConcessions] = useState(false)
    const [displayedShowings, setDisplayedShowings] = useState<(Showing & {date: Date})[]>([])

    const {playid} = useParams<EventPageProps>()
    const eventData = appSelector(state => selectEventData(state, Number.parseInt(playid)))
    if (eventData === undefined) return <p>Whoops! Event not found</p>

    const {playname, playdescription, image_url, showings} = eventData
    const showingsDates = showings.map(s => {
        const [datestring] = s.eventdate.split("T")
        let thedate = new Date(datestring + "T" + s.starttime)
        return {date: thedate, ...s}
    })
    console.log(showingsDates)
    console.log(showings)

    // TODO: Re-implement adding ticket to cart.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedShowing) return
        dispatch(addTicket({
            playId: Number.parseInt(playid),
            eventId: selectedShowing.id,
            concessions,
            qty: amount,
        }))
        dispatch(openSnackbar(`Added ${amount} ticket${amount === 1 ? "" : "s"} to cart!`))
    }

    const dateClicked = (date: Date) => {
        const sameDayShowings = showingsDates.filter(d => isSameDay(date, d.date))
        setDisplayedShowings(sameDayShowings)
    }

    // TODO: Quantity validation (positive integers only)
    return (
        <article>
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.heroImage}
                    image={image_url} />
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{titleCase(playname)}</Typography>
                    <Typography component="h2" variant="h4">Event Description</Typography>
                    <p>{(playdescription) ? playdescription : ''}</p>
                </CardContent>
            </Card>
            <div className={classes.calendarSelect}>
                <MultiSelectCalendar value={showings.map(s => new Date(s.eventdate))} onDateClicked={dateClicked} bindDates/>
                <ShowtimeSelect showings={displayedShowings} showingSelected={setSelectedShowing}/>
                <div className={classes.form}>
                    <Typography variant="h5" gutterBottom align="center">{!selectedShowing ? "Please select a showing" : format(selectedShowing.date, "MMM dd yyyy h:mm a")}</Typography>
                    <FormControl className={classes.formControl}>
                        <TextField
                            className={classes.formInput}
                            required
                            value={amount || undefined}
                            onChange={(e) => setAmount(+e.target.value)}
                            label="Quantity"
                            type="number" />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={concessions}
                                    onChange={e => setConcessions(!concessions)} name='concessions' />
                            }
                            label='Add concessions'
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Button
                            disabled={!amount || !selectedShowing}
                            color="primary"
                            variant="contained"
                            onClick={handleSubmit}>
                            Get Tickets
                        </Button>
                    </FormControl>
                </div>
            </div>
        </article>
    )
}
export default EventPage

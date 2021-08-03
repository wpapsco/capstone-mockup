import React, { useState } from 'react'
import { useAppDispatch, appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import isSameDay from "date-fns/isSameDay";
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
    FormControl,
    CardActions
} from '@material-ui/core'
import SplitPane from '../../components/SplitPane'
import HeroBanner from '../../components/HeroBanner'
import { openSnackbar } from '../snackbarSlice'
import { titleCase } from '../../utils'
import { addTicketToCart, selectPlayData } from '../ticketing/ticketingSlice'
import { Ticket } from '../ticketing/ticketingTypes'
import MultiSelectCalendar from '../../components/MultiSelectCalendar'
import ShowtimeSelect from './ShowtimeSelect'

type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()

    const [qty, setQty] = useState(0)
    const [concessions, setConcessions] = useState(false)
    const [selectedShowing, setSelectedShowing] = useState<Ticket | null>(null)
    const [displayedShowings, setDisplayedShowings] = useState<Ticket[]>([])
    const {playid} = useParams<EventPageProps>()

    const eventData = appSelector(state => selectPlayData(state, playid))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {title, description, image_url, tickets} = eventData

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedShowing!==null && qty) {
            dispatch(addTicketToCart({id: selectedShowing.eventid, qty, concessions}))
            dispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
            setQty(0)
            setSelectedShowing(null)
            setConcessions(false)
        }
    }

    const dateClicked = (date: Date) => {
        const sameDayShowings = tickets.filter(d => isSameDay(date, d.date))
        setDisplayedShowings(sameDayShowings)
    }

    return (
        <>
            <HeroBanner imgUrl={image_url}>
                <Typography variant='h2' component='h1'>{titleCase(title)}</Typography>
            </HeroBanner>
            <section>
                <SplitPane spacing={2}
                    left={
                        <div>
                            <Typography component="h2" variant="h5">Event Description</Typography>
                            <p>{(description) ? description : ''}</p>
                        </div>
                    }
                    right={
                        <>
                            <Typography variant="subtitle1" gutterBottom align="center">
                                {selectedShowing
                                    ? format(selectedShowing.date, "MMM dd yyyy h:mm a")
                                    : `Select a showing (${tickets.length} available)`
                                }
                            </Typography>

                            <MultiSelectCalendar value={tickets.map(t => t.date)} onDateClicked={dateClicked} bindDates/>
                            <ShowtimeSelect showings={displayedShowings} showingSelected={setSelectedShowing}/>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    required
                                    className={classes.formInput}
                                    value={qty || undefined}
                                    onChange={e => {
                                        const val = +e.target.value
                                        setQty((val > 0) ? val : 0)
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <FormControlLabel
                                    label='Add concessions'
                                    control={
                                        <Checkbox
                                            checked={concessions}
                                            onChange={e => setConcessions(!concessions)} name='concessions' />
                                    }
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <Button
                                    disabled={!qty || !selectedShowing}
                                    color="primary"
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    Get Tickets
                                </Button>
                            </FormControl>
                        </>
                    }
                />
            </section>
        </>
    )
}
export default EventPage

import React, { useState } from 'react'
import { useAppDispatch, appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import isSameDay from "date-fns/isSameDay";
import eventPageStyles from './eventPageStyles'
import format from "date-fns/format";
import {
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    FormControl,
    TextField,
    Typography,
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

    const [calOpen, setCalOpen] = useState(true)
    const [timePickerShown, setTimePickerShown] = useState(true)
    const [qty, setQty] = useState(0)
    const [concessions, setConcessions] = useState(false)
    const [selectedShowing, setSelectedShowing] = useState<Ticket | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date|null>(null)
    const [displayedShowings, setDisplayedShowings] = useState<Ticket[]>([])
    const {playid} = useParams<EventPageProps>()

    const eventData = appSelector(state => selectPlayData(state, playid))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {title, description, image_url, tickets} = eventData

    const resetShowSelection = () => {
        setCalOpen(true)
        setTimePickerShown(true)
        setDisplayedShowings([])
        setSelectedDate(null)
        setSelectedShowing(null)
    }

    const resetForm = () => {
        setConcessions(false)
        setQty(0)
        resetShowSelection()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedShowing!==null && qty) {
            dispatch(addTicketToCart({id: selectedShowing.eventid, qty, concessions}))
            dispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
            resetForm()
        }
    }

    const dateClicked = (date: Date) => {
        const sameDayShowings = tickets.filter(d => isSameDay(date, d.date))
        setDisplayedShowings(sameDayShowings)
        setSelectedDate(date)
        setCalOpen(false)
        setTimePickerShown(true)
    }

    const onShowingSelected = (ticket: Ticket) => {
        setSelectedShowing(ticket)
        setTimePickerShown(!timePickerShown)
    }

    const selectShowingPrompt =
        <div>
            <Typography variant='h6' component='p' gutterBottom align='center'>
                Select a Showing
            </Typography>
            <Typography variant='body1' align='center'>{`(${tickets.length} available)`}</Typography>
        </div>

    return (
        <>
            <HeroBanner imgUrl={image_url}>
                <Typography variant='h2' component='h1'>{titleCase(title)}</Typography>
            </HeroBanner>
            <section>
                <SplitPane spacing={10}
                    left={
                        <>
                            <Typography component="h2" variant="h5">Event Description</Typography>
                            <p>{(description) ? description : ''}</p>
                        </>
                    }
                    right={
                        <>
                            <Collapse in={!calOpen}>
                                <Button
                                    onClick={() =>resetShowSelection()}
                                    className={classes.changeDateBtnStyle}
                                    variant='outlined'
                                >
                                    Select different date
                                </Button>
                            </Collapse>
                            {
                                selectedDate
                                    ? (selectedShowing)
                                        ? format(selectedShowing.date, "MMM, dd yyyy - h:mm a")
                                        : format(selectedDate, 'MMM dd') + ' - Select Time Below:'
                                    : selectShowingPrompt
                            }
                            <Collapse in={calOpen}>
                                <MultiSelectCalendar value={tickets.map(t => t.date)} onDateClicked={dateClicked} bindDates/>
                            </Collapse>

                            <Collapse in={timePickerShown}>
                                <ShowtimeSelect showings={displayedShowings} showingSelected={onShowingSelected}/>
                            </Collapse>

                            <FormControl className={classes.formControl}>
                                <TextField
                                    label="Quantity"
                                    type={"number"}
                                    required
                                    className={classes.formInput}
                                    value={qty || undefined}
                                    onChange={e => {setQty((+e.target.value > 0) ? +e.target.value : 0)}}
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

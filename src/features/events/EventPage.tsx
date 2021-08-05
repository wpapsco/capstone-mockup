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
    Select,
    MenuItem,
    InputLabel
} from '@material-ui/core'
import SplitPane from '../../components/SplitPane'
import HeroBanner from '../../components/HeroBanner'
import { openSnackbar } from '../snackbarSlice'
import { titleCase } from '../../utils'
import { addTicketToCart, selectPlayData } from '../ticketing/ticketingSlice'
import { Ticket } from '../ticketing/ticketingTypes'
import MultiSelectCalendar from '../../components/MultiSelectCalendar'
import ShowtimeSelect from './ShowtimeSelect'

const add1 = (n: number) => n+1
const range = (n: number, zeroIndexed = true) => zeroIndexed
    ? Array.from(Array(n).keys())
    : Array.from(Array(n).keys()).map(add1)

// TODO: need to know 
type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    
    const {playid} = useParams<EventPageProps>()
    const [calOpen, setCalOpen] = useState(true)
    const [timePickerShown, setTimePickerShown] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date|null>(null)
    const [displayedShowings, setDisplayedShowings] = useState<Ticket[]>([])

    const [qty, setQty] = useState<number|null>(null)
    const [concessions, setConcessions] = useState(false)
    const [selectedShowing, setSelectedShowing] = useState<Ticket | undefined>(undefined)
    
    const eventData = appSelector(state => selectPlayData(state, playid))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {title, description, image_url, tickets} = eventData

    const resetShowSelection = () => {
        setCalOpen(true)
        setTimePickerShown(true)
        setDisplayedShowings([])
        setSelectedDate(null)
        setSelectedShowing(undefined)
        setQty(null)
        setConcessions(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedShowing && qty) {
            dispatch(addTicketToCart({id: selectedShowing.eventid, qty, concessions}))
            dispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
            resetShowSelection()
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
            <Typography variant='h6' component='h2' gutterBottom align='center'>
                Select a Showing
            </Typography>
            <Typography variant='body2' align='center'>({tickets.length} available)</Typography>
        </div>
    
    const qtyFieldLabel = (selectedShowing)
        ? `Quantity (${selectedShowing.availableseats} available)`
        : 'Quantity'

    const qtyIsInvalid = () => {
        const input = qty ? qty : 0
        const available = selectedShowing ? selectedShowing.availableseats : 0
        return input > available
    }

    return (
        <main>
            <HeroBanner imgUrl={image_url}>
                <Typography variant='h2' component='h1'>{titleCase(title)}</Typography>
            </HeroBanner>
            <section>
                <SplitPane spacing={10}
                    left={
                        <div className={classes.leftPanel}>
                            <section>
                                <Typography component="h2" variant="h5">
                                    Event Description
                                </Typography>
                                <Typography variant='body1'>{(description) ? description : ''}</Typography>
                            </section>
                            <section>
                                <Typography component="h2" variant="h5">
                                    Concessions Tickets
                                </Typography>
                                <Typography variant='body1'>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel, numquam. Harum, magni nostrum, incidunt dolores quia quo placeat libero molestiae totam cum reprehenderit, accusantium facilis adipisci ad mollitia rerum accusamus!
                                </Typography>
                            </section>
                        </div>
                    }
                    right={
                        <section className={classes.rightPanel}>
                            <Collapse in={!calOpen}>
                                <Button
                                    onClick={() =>resetShowSelection()}
                                    className={classes.changeDateBtnStyle}
                                    variant='outlined'
                                >
                                    Choose different date
                                </Button>
                            </Collapse>
                            {
                                selectedDate
                                    ? (selectedShowing)
                                        ? <Typography variant='subtitle1' component='h2'>{format(selectedShowing.date, "MMM, dd yyyy - h:mm a")}</Typography>
                                        : <Typography variant='subtitle1' component='h2'>{format(selectedDate, 'MMM dd') + ' - Select Time Below:'}</Typography>
                                    : selectShowingPrompt
                            }
                            <Collapse in={calOpen}>
                                <MultiSelectCalendar value={tickets.map(t => t.date)} onDateClicked={dateClicked} bindDates/>
                            </Collapse>

                            <Collapse in={timePickerShown}>
                                <ShowtimeSelect showings={displayedShowings} showingSelected={onShowingSelected}/>
                            </Collapse>

                            <FormControl className={classes.formControl}>
                                {/* <TextField
                                    label={qtyFieldLabel}
                                    type={"number"}
                                    required
                                    error={qtyIsInvalid()}
                                    disabled={!selectedShowing}
                                    className={classes.formInput}
                                    value={qty || undefined}
                                    onChange={handleSetQty}
                                /> */}
                                <InputLabel id="qty-select-label">{qtyFieldLabel}</InputLabel>
                                <Select
                                    labelId="qty-select-label"
                                    value={qty}
                                    disabled={selectedShowing===undefined}
                                    onChange={e => setQty(e.target.value as number)}
                                >
                                    {
                                        range(selectedShowing
                                            ? selectedShowing.availableseats
                                            : 0
                                        , false).map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)
                                    }
                                </Select>
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
                                    disabled={!qty || !selectedShowing || qty > selectedShowing.availableseats}
                                    color="primary"
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    Get Tickets
                                </Button>
                            </FormControl>
                        </section>
                    }
                />
            </section>
        </main>
    )
}
export default EventPage

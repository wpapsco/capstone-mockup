import { useState } from 'react'
import { useAppDispatch, appSelector } from '../../app/hooks'
import { addTicketToCart, selectCartTicketCount } from '../ticketing/ticketingSlice'
import { Ticket } from './ticketingTypes'
import { openSnackbar } from '../snackbarSlice'
import {
    Collapse,
    InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, Button, Typography,
    makeStyles, Theme
} from '@material-ui/core'
import MultiSelectCalendar from '../../components/MultiSelectCalendar'
import ShowtimeSelect from '../events/ShowtimeSelect'
import { range } from '../../utils'
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";


interface TicketPickerProps {
    tickets: Ticket[]
}
const TicketPicker = ({tickets}: TicketPickerProps) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const cartTicketCount = appSelector(selectCartTicketCount)

    const [selectedDate, setSelectedDate] = useState<Date|undefined>(undefined)
    const [displayedShowings, setDisplayedShowings] = useState<Ticket[]>([])
    const [selectedTicket, setSelectedTicket] = useState<Ticket|undefined>(undefined)
    const [qty, setQty] = useState<number|undefined>(undefined)
    const [concessions, setConcessions] = useState(false)

    const [step, setStep] = useState<1|2|3>(1)


    // Transitions to show times state
    const onDateSelect = (date: Date) => {
        setSelectedTicket(undefined)
        setSelectedDate(date)
        const sameDayShows = tickets.filter(t => isSameDay(date, t.date))
        setDisplayedShowings(sameDayShows)
        setStep(2)
        // show ShowtimeSelect
        // hide calendar
        // show change date btn
    }

    // Transitions to "choose qty & concessions" state
    const onTimeSelect = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setStep(3)
    }

    const resetWidget = () => {
        // show calendar
        // hide showtime picker
        // hide change date button
        setStep(1)
        setDisplayedShowings([])
        setQty(undefined)
        setConcessions(false)
        setSelectedTicket(undefined)
        setSelectedDate(undefined)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedTicket && qty) {
            dispatch(addTicketToCart({id: selectedTicket.eventid, qty, concessions}))
            dispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
            resetWidget()
        }
    }

    const getNumAvail = (t?: Ticket) => {
        if  (t===undefined) {
            return 0
        } else {
            const inCart = cartTicketCount[t.eventid]
            return t.availableseats - (inCart ? inCart : 0)
        }
    }

    const prompt = {
        1:  <Typography variant='subtitle1'>Select show below</Typography>,
        2:  <Typography variant='subtitle1'>
                {selectedDate ? format(selectedDate, 'eee, MMM dd') : ''}
                <b> - Choose time:</b>
            </Typography>,
        3:  <Typography variant='subtitle1'>
                {selectedTicket ? format(selectedTicket.date, 'eee, MMM dd - h:mm a') : ''}
            </Typography>
    }

    return (
        <>
            <Collapse in={step!==1}>
                <Button onClick={() => resetWidget()} className={classes.changeDateBtn} variant='outlined'>
                    Choose different date
                </Button>
            </Collapse>
            {prompt[step]}
            <Collapse in={step===1}>
                <MultiSelectCalendar
                    value={tickets.map(t => t.date)}
                    onDateClicked={onDateSelect}
                    bindDates
                />
            </Collapse>
            {/* TODO: consider changing to regular Select list */}
            <Collapse in={step===2}>
                <ShowtimeSelect
                    showings={displayedShowings}
                    showingSelected={onTimeSelect}
                />
            </Collapse>
            <FormControl className={classes.formControl}>
                <InputLabel id="qty-select-label">Quantity</InputLabel>
                <Select
                    labelId="qty-select-label"
                    value={qty}
                    disabled={selectedTicket===undefined}
                    onChange={e => setQty(e.target.value as number)}
                >
                    {
                        range(getNumAvail(selectedTicket), false)
                            .map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)
                    }
                </Select>
            </FormControl>
            {/* className formControl */}
            <FormControl className={classes.formControl}>
                <FormControlLabel
                    label='Add concessions'
                    control={
                        <Checkbox
                            disabled={!selectedTicket}
                            checked={concessions}
                            onChange={e => setConcessions(!concessions)} name='concessions' />
                    }
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <Button
                    disabled={!qty || !selectedTicket || qty > selectedTicket.availableseats}
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Get Tickets
                </Button>
            </FormControl>
        </>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    formControl: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '100%',
    },
    changeDateBtn: {
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
        // textDecoration: 'underline',
        padding: theme.spacing(2),
        fontSize: '0.8em',
    },
}))


export default TicketPicker


/*
    const dispatch = useAppDispatch()
    // Ticket picker state
    const [calOpen, setCalOpen] = useState(true)
    const [timePickerShown, setTimePickerShown] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date|null>(null)
    const [displayedShowings, setDisplayedShowings] = useState<Ticket[]>([])
    // State for rest of form
    const [qty, setQty] = useState<number|null>(null)
    const [concessions, setConcessions] = useState(false)
    const [selectedShowing, setSelectedShowing] = useState<Ticket | undefined>(undefined)
    const ticketsInCart = appSelector(selectCartTicketCount) //list of event/ticket IDs
    

    // filter by tickets not already in cart
    const availableTickets = tickets.filter(t => !ticketsInCart.some(id => id===t.eventid))

    const resetShowSelection = () => {
        setCalOpen(true)
        setTimePickerShown(true)
        setDisplayedShowings([])
        setSelectedDate(null)
        setSelectedShowing(undefined)
        setQty(null)
        setConcessions(false)
    }

    // const dateClicked = (date: Date) => {
    //     const sameDayShowings = availableTickets.filter(d => isSameDay(date, d.date))
    //     setDisplayedShowings(sameDayShowings)
    //     setSelectedDate(date)
    //     setCalOpen(false)
    //     setTimePickerShown(true)
    // }

    const onShowingSelected = (ticket: Ticket) => {
        setSelectedShowing(ticket)
        setTimePickerShown(!timePickerShown)
    }

    const selectShowingPrompt =
        <div>
            <Typography variant='h6' component='h2' gutterBottom align='center'>
                Select a Showing
            </Typography>
            <Typography variant='body2' align='center'>({availableTickets.length} available)</Typography>
        </div>
    
    const qtyFieldLabel = (selectedShowing)
        ? `Quantity (${selectedShowing.availableseats} available)`
        : 'Quantity'

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
                                    <MultiSelectCalendar value={availableTickets.map(t => t.date)} onDateClicked={dateClicked} bindDates/>
                                </Collapse>

                                <Collapse in={timePickerShown}>
                                    <ShowtimeSelect showings={displayedShowings} showingSelected={onShowingSelected}/>
                                </Collapse>

                                <FormControl className={classes.formControl}>
                                    <InputLabel id="qty-select-label">{qtyFieldLabel}</InputLabel>
                                    <Select
                                        labelId="qty-select-label"
                                        value={qty}
                                        disabled={selectedShowing===undefined}
                                        onChange={e => setQty(e.target.value as number)}>
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

                            </section>
*/
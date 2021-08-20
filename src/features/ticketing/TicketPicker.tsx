import { useAppDispatch, appSelector } from '../../app/hooks'
import { addTicketToCart, selectCartTicketCount, Ticket } from '../ticketing/ticketingSlice'
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
import { useReducer } from 'react'

interface TicketPickerState {
    selectedDate?: Date,
    displayedShowings: Ticket[],
    selectedTicket?: Ticket,
    qty: number,
    concessions: boolean,
    showCalendar: boolean,
    showTimes: boolean,
    showClearBtn: boolean,
    promptIndex: 1 | 2 | 3,
}
const initialState: TicketPickerState = {
    displayedShowings: [],
    qty: 0,
    concessions: false,
    showCalendar: true,
    showTimes: false,
    showClearBtn: false,
    promptIndex: 1,
}

const dateSelected = (d: Date) => ({type: 'date_selected', payload: d})
const timeSelected = (t: Ticket) => ({type: 'time_selected', payload: t})
const resetWidget = () => ({type: 'reset'})
const changeQty = (n: number) => ({type: 'change_qty', payload: n})

interface TicketPickerProps {
    tickets: Ticket[]
}
const TicketPicker = ({tickets}: TicketPickerProps) => {

    const TicketPickerReducer = (state: TicketPickerState, action: any): TicketPickerState => {
        switch (action.type) {
            case 'date_selected': {
                const sameDayShows = tickets.filter(t => isSameDay(action.payload, t.date))
                console.log(action.payload, sameDayShows)
                return {
                    ...state,
                    selectedDate: action.payload,
                    selectedTicket: undefined,
                    displayedShowings: sameDayShows,
                    showCalendar: false,
                    showTimes: true,
                    showClearBtn: true,
                    promptIndex: 2,
                }
            }
            case 'time_selected': {
                return {...state, selectedTicket: action.payload, showTimes: false, promptIndex: 3}
            }
            case 'reset': {
                return initialState
            }
            case 'change_qty': {
                return {...state, qty: action.payload}
            }
            case 'toggle_concession': {
                return {...state, concessions: !state.concessions}
            }
            default:
                throw new Error('Received undefined action type')
        }
    }

    const [{
        qty,
        concessions,
        promptIndex,
        selectedDate,
        displayedShowings,
        selectedTicket,
        showCalendar,
        showTimes,
        showClearBtn,
    }, dispatch] = useReducer(TicketPickerReducer, initialState)

    const classes = useStyles()
    const appDispatch = useAppDispatch()
    const cartTicketCount = appSelector(selectCartTicketCount)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedTicket && qty) {
            appDispatch(addTicketToCart({id: selectedTicket.eventid, qty, concessions}))
            appDispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
            dispatch(resetWidget())
        }
    }

    const numAvail = selectedTicket
        ? cartTicketCount[selectedTicket.eventid]
            ? selectedTicket.availableseats - cartTicketCount[selectedTicket.eventid]
            : selectedTicket.availableseats
        : 0

    const prompt = {
        1:  <Typography variant='subtitle1'>Select date below ({tickets.length} showings)</Typography>,
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
            <Collapse in={showClearBtn}>
                <Button onClick={() => dispatch(resetWidget())} className={classes.changeDateBtn} variant='outlined'>
                    Choose different date
                </Button>
            </Collapse>
            {prompt[promptIndex]}
            <Collapse in={showCalendar}>
                <MultiSelectCalendar
                    value={tickets.map(t => t.date)}
                    onDateClicked={(d) => dispatch(dateSelected(d))}
                    bindDates
                />
            </Collapse>
            <Collapse in={showTimes}>
                <ShowtimeSelect
                    showings={displayedShowings}
                    showingSelected={(t) => dispatch(timeSelected(t))}
                />
            </Collapse>
            <FormControl className={classes.formControl}>
                <InputLabel id="qty-select-label">
                    {selectedTicket
                        ? (numAvail > 0) ? 'Quantity' : 'Already in Cart'
                        : 'Quantity (select ticket)'
                    }
                </InputLabel>
                <Select
                    labelId="qty-select-label"
                    value={qty}
                    disabled={selectedTicket===undefined || numAvail < 1}
                    onChange={e => dispatch(changeQty(e.target.value as number))}
                    MenuProps={{classes: {paper: classes.menuPaper}}}
                >
                    {range(numAvail, false).map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <FormControlLabel
                    label='Add concessions ticket'
                    control={
                        <Checkbox
                            disabled={!selectedTicket}
                            checked={concessions}
                            onChange={e => dispatch({type: 'toggle_concession'})} name='concessions' />
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
    menuPaper: {
        maxHeight: '200px',
    },
    boundWidth: {
        maxWidth: '100%',
    }
}))


export default TicketPicker


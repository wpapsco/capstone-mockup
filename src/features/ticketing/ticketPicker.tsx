import { appSelector, useAppDispatch } from '../../app/hooks'
import { selectTicket, selectSelectedTicket } from './ticketingSlice'
import {
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@material-ui/core'
import eventPageStyles from '../events/eventPageStyles'


const TicketPicker = (props: {playid: string}) => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    const selectedTicket = appSelector(selectSelectedTicket)
    const tickets = appSelector(state =>
        state.ticketing.tickets
            .filter(ticket => ticket.playid===props.playid)
    )
    // TODO: sort by date
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink id='select-ticket-label'>
                Available tickets
            </InputLabel>
            <Select
                required
                labelId='select-ticket-label'
                value={selectedTicket}
                onChange={e => dispatch(selectTicket(e.target.value as number))}
            >
                {tickets.map(t =>
                    <MenuItem key={t.eventid} value={t.eventid}>
                        {`${t.eventdate}, ${t.starttime} - ${t.ticket_price} (${t.concession_price} concessions)`}
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    )
}

export default TicketPicker
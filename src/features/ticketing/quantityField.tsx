import { appSelector, useAppDispatch } from '../../app/hooks'
import { FormControl, Input } from '@material-ui/core'
import { setQty, selectTicketQty } from './ticketingSlice'
import eventPageStyles from '../events/eventPageStyles'

const QuantityField = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    const amount = appSelector(selectTicketQty)

    return (
        <FormControl className={classes.formControl}>
            <Input
                className={classes.formInput}
                required
                value={amount || null}
                onChange={e => dispatch(setQty(
                    (Number.parseInt(e.target.value) > 0)
                        ? Number.parseInt(e.target.value)
                        : 0
                ))}
                // label="Quantity"
                type={"number"} />
        </FormControl>
    )
}

export default QuantityField
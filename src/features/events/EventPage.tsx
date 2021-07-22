import React, {useState} from 'react'
import {useAppDispatch, appSelector} from '../../app/hooks'
import {useParams} from 'react-router-dom'
import {selectEventData, Showing} from './eventsSlice'
import { addTicket } from '../cart/cartSlice'
import eventPageStyles from './eventPageStyles'
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
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

type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    const [amount, setAmount] = useState(0)
    const [showingId, setShowingId] = useState(0)
    const [concessions, setConcessions] = useState(false)

    const {playid} = useParams<EventPageProps>()
    const eventData = appSelector(state => selectEventData(state, Number.parseInt(playid)))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {playname, playdescription, image_url, showings} = eventData

    // TODO: Re-implement adding ticket to cart.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(addTicket({
            playId: Number.parseInt(playid),
            eventId: showingId,
            concessions,
            qty: amount,
        }))
        dispatch(openSnackbar(`Added ${amount} ticket${amount === 1 ? "" : "s"} to cart!`))
    }

    const ShowingsList = (props: {showings: Showing[]}) =>
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="select-showing-label">
                Select a showing
            </InputLabel>
            <Select
                required
                labelId="select-showing-label"
                id="select-showing"
                value={showingId}
                onChange={e => setShowingId(e.target.value as number)}
                className={classes.formInput} >
                {props.showings.map((sh: Showing) =>
                    <MenuItem key={sh.id} value={sh.id}>
                        {dayMonthDate(sh.eventdate) + ' - ' + militaryToCivilian(sh.starttime)}
                    </MenuItem>
                )}
            </Select>
        </FormControl>

    // TODO: Quantity validation (positive integers only)
    return (
        <article>
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.heroImage}
                    image={image_url} />
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{titleCase(playname)}</Typography>
                    <CardActions className={classes.cardActions}>
                        <ShowingsList showings={showings} />
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
                                disabled={!amount || !showingId}
                                color="primary"
                                variant="contained"
                                onClick={handleSubmit}>
                                Get Tickets
                            </Button>
                        </FormControl>
                    </CardActions>
                </CardContent>
            </Card>
            <main>
                <Typography component="h2" variant="h4">Event Description</Typography>
                <p>{(playdescription) ? playdescription : ''}</p>
            </main>
        </article>
    )
}
export default EventPage

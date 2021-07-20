import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import { selectEventData, Showing } from './eventsSlice'
import eventPageStyles from './eventPageStyles'
import { openSnackbar } from '../snackbarSlice'
import { titleCase, dayMonthDate, militaryToCivilian } from '../../utils'

type EventPageProps = { eventname: string }
const EventPage = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch() 
    const [amount, setAmount] = useState(0)
    const { playKey } = useParams<EventPageProps>()

    const { eventname } = useParams<EventPageProps>()
    const eventData = appSelector(state => selectEventData(state, eventname))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    
    const { playname, playdescription, image_url, showings } = eventData

    // TODO: Re-implement adding ticket to cart.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(openSnackbar(`Added ${amount} ticket${amount === 1 ? "" : "s"} to cart!`))
    }

    // TODO: Render showtime & date
    // TODO: Get image to render
    return (
        <article>
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.heroImage}
                    image={image_url}
                />
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{titleCase(playname)}</Typography>

                    <CardActions className={classes.cardActions}>
                        <TextField
                            className={classes.qtyField}
                            required
                            value={amount || undefined}
                            onChange={(e) => setAmount(+e.target.value)}
                            label="Quantity"
                            type="number"
                        />
                        <Button disabled={!amount} color="primary" variant="contained" onClick={handleSubmit}>Get Tickets</Button>
                    </CardActions>
                </CardContent>
            </Card>
            <main>
                <Typography component="h2" variant="h4">Event Description</Typography>
                <p>{(playdescription) ? playdescription : ''}</p>
                <Typography component="h2" variant="h4">Showings</Typography>
                <ShowingsList showings={showings} />
            </main>
        </article>
    )
}
export default EventPage
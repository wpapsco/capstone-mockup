import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import { selectEventData, Showing } from './eventsSlice'

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { openSnackbar } from '../snackbarSlice'
import { titleCase, dayMonthDate, militaryToCivilian } from '../../utils'

const useStyles = makeStyles((theme) => ({
    cardRoot: {
        display: 'flex',
        height: '400px',
        marginBottom: 40,
    },
    cardContents: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 'auto',
    },
    heroImage: {
        width: '500px',
    },
    cardActions: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
    },  
    qtyField: {
        maxWidth: '100px',
    },
    showtime: {
        textAlign: 'center'
    }
}))

const ShowingRow = (props: Showing) =>
    <li>{`${dayMonthDate(props.eventdate)}, ${militaryToCivilian(props.starttime)}: ${props.availableseats} tickets available`}</li>
    
const ShowingsList = (props: {showings: Showing[]}) =>
    <ul>
        {props.showings.map(sh => <ShowingRow key={sh.id} {...sh} />)}
    </ul>


type EventPageProps = { playKey: string }
const EventPage = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch() 
    const [amount, setAmount] = useState(0)
    const { playKey } = useParams<EventPageProps>()

    const eventData = appSelector(state => selectEventData(state, playKey))
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
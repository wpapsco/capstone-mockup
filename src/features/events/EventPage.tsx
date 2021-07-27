import React, { useState } from 'react'
import { useAppDispatch, appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import eventPageStyles from './eventPageStyles'
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    FormControl
} from '@material-ui/core';
import { openSnackbar } from '../snackbarSlice'
import { titleCase } from '../../utils'

import TicketPicker from '../ticketing/ticketPicker'
import QuantityField from '../ticketing/quantityField'
import {
    addTicketToCart,
    selectSelectedTicket,
    selectTicketQty,
    clearSelection
} from '../ticketing/ticketingSlice'

type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = eventPageStyles()
    const dispatch = useAppDispatch()
    const qty = appSelector(selectTicketQty)
    const selectedTicket = appSelector(selectSelectedTicket)
    const [concessions, setConcessions] = useState(false)

    const { playid } = useParams<EventPageProps>()
    const eventData = appSelector(state => state.ticketing.plays.find(p => p.id===playid))

    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {title, description, image_url} = eventData

    const handleSubmit = (e: React.FormEvent) => {
        if (selectedTicket!==null && qty) {
            e.preventDefault()
            dispatch(addTicketToCart({id: selectedTicket, qty, concessions}))
            dispatch(clearSelection())
            dispatch(openSnackbar(`Added ${qty} ticket${qty === 1 ? "" : "s"} to cart!`))
        }
    }

    // TODO: Quantity validation (positive integers only)
    // TODO: ShowingsList
    return (
        <article>
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.heroImage}
                    image={image_url} />
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{titleCase(title)}</Typography>
                    <CardActions className={classes.cardActions}>

                        <TicketPicker playid={playid}/>
                        <QuantityField />
                        
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
                                disabled={!qty || !selectedTicket}
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
                <p>{(description) ? description : ''}</p>
            </main>
        </article>
    )
}
export default EventPage

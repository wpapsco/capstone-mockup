/* * * * * * * * EVENT PAGE DATA * * * * * * * * 
 *
 * How pretty can I get away with making this page?
 * 
 * HEADER DATA
 * - Title
 * - Show day, date & time
 * - Address
 * - Main Image
 * 
 * MAIN BODY
 * - Description
 * - Concessions description
 * - Location Map
 * - Contact Information
 * - Optional Additional Images
 * 
 * * * * * * * * * * * * * * * * * * * * * * * */ 
import React, { useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import { selectEventShowings } from './eventsSlice'

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '../../theme'
import { openSnackbar } from '../snackbarSlice'

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


type EventPageProps = { playname: string }
export default function EventPage() {
    const classes = useStyles()
    const dispatch = useAppDispatch() 
    const [amount, setAmount] = useState(0)

    const { playname } = useParams<EventPageProps>()
    const eventData = appSelector(state => selectEventShowings(state, playname))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    
    const eventName = eventData[0].playname

// TODO: Re-implement adding ticket to cart.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(openSnackbar(`Added ${amount} ticket${amount === 1 ? "" : "s"} to cart!`))
    }

    // TODO: Render showtime & date
    // TODO: Get image to render
    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.heroImage}
                    image={'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701'}
                />
                <CardContent className={classes.cardContents}>
                    <Typography component="h1" variant="h3" align="center" gutterBottom>{eventName}</Typography>

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
        </ThemeProvider>
    )
}


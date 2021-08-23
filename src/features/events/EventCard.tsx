// This implementation should replace the EventRow component in the EventsList
import { titleCase } from '../../utils'
import { Card, CardContent, CardMedia, Button, Typography } from '@material-ui/core'
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { Event } from '../ticketing/ticketingSlice'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: '1em',
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            minHeight: '300px',
        }
    },
    cardMedia: {
        minWidth: '400px',
        justifySelf: 'end',
    },
    cardContent: {
        padding: '1.8em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // maxWidth: '60%',
    },
    callToAction: {
        alignSelf: 'center',
        textDecoration: 'none',
        [theme.breakpoints.down('md')]: {
            marginTop: '1em'
        },
        [theme.breakpoints.up('md')]: {
            marginTop: 'auto'
        },
        width: "100%"
    },
}))

const EventCard = (props: Event) => {
    const theme = useTheme()
    const classes = useStyles(theme)

    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
                <Typography component='h2' variant='h5'>{titleCase(props.title)}</Typography>
                <Typography variant='body1'>
                    {(props.description)
                        ? props.description
                        : 'No description available.'
                    }
                </Typography>
                <Link to={`/events/${props.id}`} className={classes.callToAction}>
                    <Button variant="contained" color="primary" fullWidth>
                        See Showings
                    </Button>
                </Link>
            </CardContent>
            <CardMedia
                className={classes.cardMedia}
                image={props.image_url}
                title={`Photo of ${props.title} performance`}
            />
        </Card>
    )
}

export default EventCard

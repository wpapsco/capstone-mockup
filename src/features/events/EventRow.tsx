import {makeStyles} from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'

import { Event } from './eventsSlice'
import { Link } from 'react-router-dom'
import { BookmarkBorderOutlined, ShoppingCartOutlined } from '@material-ui/icons'

import { urlFriendly } from '../../utils'

// TODO: import { theme } from '../../theme'
const useStyles = makeStyles({
    root: {
        display: 'flex',
        height: '280px',
        margin: '30px 0px',
        textDecoration: 'none',
    },
    title: {
        marginBottom: 15,
    },
    description: {
        marginBottom: 10,
        minHeight: 80,
        maxHeight: 100,
    },
    actionsBar: {
        display: 'flex',
        padding: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '50px',
    },
    icon: {
        marginTop: 8
    },
    cardContents: {
        display: 'flex',
        flex: 'auto',
        maxWidth: 350,
        padding: '30px 15px',
        flexDirection: 'column',
    },
    media: {
        width: 400,
    },
    cta: {
        marginTop: 20,
    }
})

// TODO: Display date range of showings (earliest & latest)
// TODO: Images for events
// TODO: Make event data in redux is compatible with EventRow component
// TODO: Make event data in redux is compatible with EventRow component
export default function EventRow(event: Event) {
    const classes = useStyles()

    return (
        <Card className={classes.root}>
            <div className={classes.actionsBar}>
                <Typography variant='subtitle1'></Typography>
                <BookmarkBorderOutlined className={classes.icon} />
                <ShoppingCartOutlined className={classes.icon} />
            </div>

            <CardContent className={classes.cardContents}>
                <Typography variant='h5' component='h2' className={classes.title}>{event.playname}</Typography>
                <Typography variant='body1' className={classes.description}>{event.playdescription}</Typography>

                <Link to={`/events/${urlFriendly(event.playname)}`}>
                    <Button className={classes.cta} variant='outlined' color='primary'>View Event</Button>
                </Link>
            </CardContent>

            <CardMedia
                className={classes.media}
                image={'https://i.guim.co.uk/img/media/b5df93588386c0565177648cf41f3aff72c63400/0_217_5657_3395/master/5657.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a917ce8d52959d36bb08ad29184e2701'}
            />
        </Card>
    )
}

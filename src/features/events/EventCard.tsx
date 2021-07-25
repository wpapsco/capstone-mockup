// This implementation should replace the EventRow component in the EventsList
import { titleCase } from '../../utils'
import { Card, CardContent, CardMedia, Button, Typography } from '@material-ui/core'
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'space-between',
        height: '300px',
        width: '100%',
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
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
        // maxWidth: '60%',
    },
    callToAction: {
        alignSelf: 'center',
        marginTop: 'auto',
    },
}))

const EventCard = (props: {
    playname: string,
    playdescription: string,
    image_url: string,
    playid: number,
}) => {
    const classes = useStyles(useTheme())

    return (
        <Card className={classes.root}>
            <CardContent className={classes.cardContent}>
                <Typography component='h2' variant='h5'>{titleCase(props.playname)}</Typography>
                <Typography variant='body1'>
                    {(props.playdescription) ?
                        props.playdescription :
                        'No description available.'
                    }
                </Typography>
                <Link to={`/events/${props.playid}`} className={classes.callToAction}>
                    <Button variant="contained" color="primary">
                        See Showings
                    </Button>
                </Link>
            </CardContent>
            <CardMedia
                className={classes.cardMedia}
                image={props.image_url}
                title={`Photo of ${props.playname} performance`}
            />
        </Card>
    )
}

export default EventCard

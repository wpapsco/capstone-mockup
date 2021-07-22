// This implementation should replace the EventRow component in the EventsList
import { titleCase } from '../../utils'
import { Card, CardContent, CardMedia, Button } from '@material-ui/core'
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
        width: '300px',
        justifySelf: 'end',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    callToAction: {
        alignSelf: 'center',
        justifySelf: 'end',
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
                <h2>{titleCase(props.playname)}</h2>
                <p>{(props.playdescription) ?
                    props.playdescription :
                    'No description available.'
                }</p>
                <Link to={`/events/${props.playid}`}>
                    <Button
                        className={classes.callToAction}
                        variant="contained"
                        color="primary"
                    >
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

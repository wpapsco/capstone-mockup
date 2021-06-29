import Card from '@material-ui/core/Card';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { EventDetails } from './eventsSlice';
import { NarrowShowDate } from '../../components/Showtime';
import { Link } from 'react-router-dom'
import { theme } from '../../theme';
import Button from '@material-ui/core/Button'
import { BookmarkBorderOutlined, ShoppingCartOutlined } from '@material-ui/icons';


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
});

export default function EventRow(event: EventDetails) {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.root}>
                <div className={classes.actionsBar}>
                    <NarrowShowDate date={event.date} />
                    <Typography variant='subtitle1'></Typography>
                    <BookmarkBorderOutlined className={classes.icon} />
                    <ShoppingCartOutlined className={classes.icon} />
                </div>

                <CardContent className={classes.cardContents}>
                    <Typography variant='h5' component='h2' className={classes.title}>{event.name}</Typography>
                    <Typography variant='body1' className={classes.description}>{event.shortDesc}</Typography>

                    <Link to={`/events/${event.id}`}>
                        <Button className={classes.cta} variant='outlined' color='primary'>View Event</Button>
                    </Link>
                </CardContent>

                <CardMedia
                    className={classes.media}
                    image={event.imgUrl}
                />
            </Card>
        </ThemeProvider>
    )
}

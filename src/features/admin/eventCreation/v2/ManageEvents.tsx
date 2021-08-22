import {
    Button,
    Card,
    CardContent,
    CardActions,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core"
import { useHistory } from "react-router"
import { appSelector } from "../../../../app/hooks"


const TEST_ID = '1'

export default function ManageEventsPage() {
    // const events = appSelector(state => state.ticketing.plays)
    const classes = useStyles()
    const history = useHistory()

    return (
        <div>
            <Typography component='h1' variant='h4'>Manage Events</Typography>

            <Event
                className={classes.eventCard}
                title='Test Play 1'
                onClickEdit={() => history.push(`/admin/EditEvent/${TEST_ID}`)}
            />

            <Button onClick={() => history.push('/admin/CreateEvents')} variant='contained' color='primary'>
                Create New Event
            </Button>
        </div>
    )
}

interface EventProps {
    className?: string,
    title: string,
    onClickEdit: () => void
}
const Event = (props: EventProps) => {
    return (
        <Card className={props.className}>
            <Typography component='h2' variant='h5'>{props.title}</Typography>
            <CardContent className='eventBody'>
                <div className='eventInfo'>
                    <Typography><b>Details:</b></Typography>
                    <Typography variant='body1'>Capacity: 30</Typography>
                    <Typography variant='body1'>Admission type: General Admission</Typography>
                    <Typography variant='body1'>Ticket price: $15.00</Typography>
                    <Typography variant='body1'>Concessions price: $5.00</Typography>
                </div>
                <div className='eventShowings'>
                    <Typography><b>Showings:</b></Typography>
                    <Typography variant='body1'>Mon, Aug 23, 7:30PM</Typography>
                    <Typography variant='body1'>Mon, Aug 30, 8:00PM</Typography>
                    <Typography variant='body1'>Mon, Sep 6, 7:30PM</Typography>
                    <Typography variant='body1'>+ 8 more</Typography>
                </div>
                <CardActions className='eventActions'>
                    <Button variant='outlined' onClick={props.onClickEdit}>
                        Edit
                    </Button>
                    {/* TODO: Ask if sure about deleting & include # of showings associated */}
                    <Button>Delete</Button>
                </CardActions>
            </CardContent>
        </Card>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    eventCard: {
        padding: theme.spacing(4),
        margin: `${theme.spacing(2.5)}px 0`,
        height: '200px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        '& :first-child': { margin: 0},
        '& .eventBody': {
            display: 'flex',
            justifyContent: 'space-between',
        },
        '& .eventInfo, .eventShowings, .eventActions': {
            display: 'flex',
            flexDirection: 'column',
            margin: `0 ${theme.spacing(1)}px`,
        },
        '& .eventActions': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            '& > button': { minWidth: '140px' }
        },
        '& button:first-of-type:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold'
        },
    },
}))
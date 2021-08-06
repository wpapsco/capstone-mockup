import { appSelector } from '../../app/hooks'
import { useParams } from 'react-router-dom'
import {
    Container,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import SplitPane from '../../components/SplitPane'
import HeroBanner from '../../components/HeroBanner'
import { titleCase } from '../../utils'
import { selectPlayData } from '../ticketing/ticketingSlice'
import TicketPicker from '../ticketing/TicketPicker'
import ScrollToTop from '../../components/ScrollToTop'

type EventPageProps = {playid: string}
const EventPage = () => {
    const classes = useStyle()
    const {playid} = useParams<EventPageProps>()
    const eventData = appSelector(state => selectPlayData(state, playid))
    if (eventData === undefined) return <p>Whoops! Event not found</p>
    const {title, description, image_url, tickets} = eventData

    return (
        <main>
            <HeroBanner imgUrl={image_url}>
                <Typography variant='h2' component='h1'>{titleCase(title)}</Typography>
            </HeroBanner>
            <Container maxWidth='md'>
                <section style={{paddingTop: "50vh"}}>
                    <SplitPane spacing={10}
                        left={
                            <div className={classes.leftPanel}>
                                <section>
                                    <Typography component="h2" variant="h5">
                                        Event Description
                                    </Typography>
                                    <Typography variant='body1'>{(description) ? description : ''}</Typography>
                                </section>
                                <section>
                                    <Typography component="h2" variant="h5">
                                        Concessions Tickets
                                    </Typography>
                                    <Typography variant='body1'>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel, numquam. Harum, magni nostrum, incidunt dolores quia quo placeat libero molestiae totam cum reprehenderit, accusantium facilis adipisci ad mollitia rerum accusamus!
                                    </Typography>
                                </section>
                            </div>
                        }
                        right={
                            <div className={classes.rightPanel}>
                                <Typography component='h2' variant='h5'>
                                    Select Tickets
                                </Typography>
                                <TicketPicker tickets={tickets} />
                            </div>
                        }
                    />
                </section>
            </Container>
        </main>
    )
}
export default EventPage

const useStyle = makeStyles((theme: Theme) => ({
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    leftPanel: {
        '& section': {
            marginTop: theme.spacing(8)
        },
        '& section:first-of-type': {
            marginTop: 0
        },
    }
}))
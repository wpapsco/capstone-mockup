import { Event } from '../features/events/eventsSlice'
import ShowingCard from "./ShowingCard"
import Grid from '@material-ui/core/Grid'
import { titleCase } from '../utils'

export interface ShowingsGroupProps {
    eventTitle: string,
    showings: Event[],
}
const ShowingsGroup = (props: ShowingsGroupProps) => {
    const showings = props.showings.map(show =>
        <Grid item key={show.id} xs={12} sm={6} md={4}>
            <ShowingCard
                {...show}
                eventName={props.eventTitle}
                desc={show.playdescription}
                id={show.id.toString()}
            />
        </Grid>
    )
    return (
        <section>
            <h2>{titleCase(props.eventTitle)}</h2>
            <Grid container spacing={3}>
                {showings}
            </Grid>
        </section>
    )
}

export default ShowingsGroup
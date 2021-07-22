import { Showing } from '../features/events/eventsSlice'
import ShowingCard from "./ShowingCard"
import Grid from '@material-ui/core/Grid'
import { titleCase } from '../utils'

export interface ShowingsGroupProps {
    eventTitle: string,
    eventDesc?: string,
    image_url: string,
    showings: Showing[],
}
const ShowingsGroup = (props: ShowingsGroupProps) => {
    const showings = props.showings.map(show =>
        <Grid item key={show.id} xs={12} sm={6} md={4}>
            <ShowingCard
                {...show}
                image_url={props.image_url}
                eventName={props.eventTitle}
                desc={props.eventDesc}
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
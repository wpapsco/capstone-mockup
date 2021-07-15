import { Showing } from '../features/events/eventsSlice'
import ShowingCard, { ShowingProps } from "./ShowingCard"
import Grid from '@material-ui/core/Grid'

export interface ShowingsGroupProps {
    eventTitle: string,
    imageUrl: string,
    showings: Showing[],
}
// TODO: render ShowingCards
const ShowingsGroup = (props: ShowingsGroupProps) => {
    return (
        <section>
            <h2>{props.eventTitle}</h2>
            <Grid container spacing={3}>
                
            </Grid>
        </section>
    )
}

export default ShowingsGroup

/*
const showingCards = Object.keys(showingsByEvent).map((show: ShowingProps) => (
    <Grid item xs={12} sm={6} md={4}>
        <Showing
            key={show.id}
            {...show}
            onSelected={() => props.showingSelected()} />
    </Grid>
))
*/
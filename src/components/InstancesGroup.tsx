import { Instance } from '../features/events/eventsSlice'
import InstanceCard from "./InstanceCard"
import Grid from '@material-ui/core/Grid'
import { titleCase } from '../utils'

export interface InstancesGroupProps {
    eventTitle: string,
    eventDesc?: string,
    image_url: string,
    instances: Instance[],
}
const InstancesGroup = (props: InstancesGroupProps) => {
    const instances = props.instances.map(instance =>
        <Grid item key={instance.id} xs={12} sm={6} md={4}>
            <InstanceCard
                {...instance}
                image_url={props.image_url}
                eventName={props.eventTitle}
                desc={props.eventDesc}
                id={instance.id.toString()}
            />
        </Grid>
    )
    return (
        <section>
            <h2>{titleCase(props.eventTitle)}</h2>
            <Grid container spacing={3}>
                {instances}
            </Grid>
        </section>
    )
}

export default InstancesGroup
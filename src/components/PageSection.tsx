import Typography from '@material-ui/core/Typography';

export const PageSection = (props: { heading: string, contents: string }) =>
        <section>
            <Typography component="h2" variant="h4" gutterBottom>{props.heading}</Typography>
            <Typography variant="body1" paragraph>{props.contents}</Typography>
        </section>
import Showing from "./Showing";
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

export default function ShowingsPage(props: {showingSelected: (a: string) => any}) {

    const arr = new Array(10).fill(
        <Grid item xs={12} sm={6} md={4}>
            <Showing onSelected={() => props.showingSelected("uhh")}/>
        </Grid>
    )

    return (
        <div>
            <Typography variant="h2">Select a Showing</Typography>
            <Grid container spacing={3}>
                {arr}
            </Grid>
        </div>
    );
}

import { Grid, Paper, Fab, makeStyles } from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

type CreatedShowTimesProps = {
    id: number,
    eventDate: Date,
    startTime: string,
    totalSeats: number,

};

const useStyles = makeStyles({
    root: {
        marginTop: "20px",
        height: "50px"
    }
})

export default function ShowTimeListing({id, eventDate, startTime, totalSeats}: CreatedShowTimesProps) {
    const classes = useStyles();

    const onEditTime = (id: number) => {
        console.log('Editing id: ' + id);
    }

    const onRemoveTime = (id: number) => {
        console.log("Removing id: " + id);
    }

    return(
        <Grid container component={Paper} className={classes.root}>
            <Grid item xs={1}>
                { id }  
            </Grid>
            <Grid item xs={3}>
                { eventDate }
            </Grid>
            <Grid item xs={3}>
                { startTime }
            </Grid>
            <Grid item xs={3}>
                { totalSeats } 
            </Grid>
            <Grid item xs={1}>
                <Fab size="small" onClick={() => onEditTime(id)}>
                    <EditRoundedIcon />
                </Fab>
            </Grid>
            <Grid item xs={1}>
                <Fab size="small" onClick={() => onRemoveTime(id)}>
                    <RemoveIcon />
                </Fab>
            </Grid>
        </Grid>
    )
}
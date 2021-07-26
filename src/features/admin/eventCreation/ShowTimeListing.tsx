import { Grid, Paper, Fab, makeStyles } from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

const useStyles = makeStyles({
    root: {
        marginTop: "20px",
        height: "50px"
    }
})
export default function ShowTimeListing() {
    const classes = useStyles();

    return(
        <Grid container component={Paper} className={classes.root}>
            <Grid item xs={1}>
                1  
            </Grid>
            <Grid item xs={3}>
                {new Date().toDateString()}
            </Grid>
            <Grid item xs={3}>
                25
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={1}>
                <Fab size="small">
                    <EditRoundedIcon />
                </Fab>
            </Grid>
            <Grid item xs={1}>
                <Fab size="small">
                    <RemoveIcon />
                </Fab>
            </Grid>
        </Grid>
    )
}
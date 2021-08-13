import { useState } from "react";
import { Grid, Paper, Fab, TextField, makeStyles } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import RemoveIcon from "@material-ui/icons/Remove";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

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
    },
    chip: {
        marginTop: "5px",
    }
})

export default function ShowTimeListing({id, eventDate, startTime, totalSeats}: CreatedShowTimesProps) {
    const classes = useStyles();
    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const onEditTime = () => {
        setIsEditMode(!isEditMode);
    }

    const onRemoveTime = (id: number) => {
        console.log("Removing id: " + id);
    }

    return(
        <Grid container component={Paper} className={classes.root}>
            <Grid item xs={1}>
                <Chip label={ id } color={isEditMode ? "primary" : "secondary"} className={ classes.chip }/>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    defaultValue={ eventDate.toISOString().slice(0, 10) }
                    disabled={ isEditMode }
                    type="date"
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    defaultValue={ startTime }
                    disabled={ isEditMode }
                    type="time"
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    defaultValue={ totalSeats } 
                    disabled={ isEditMode }
                    type="number"
                />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={1}>
                <Fab size="small" onClick={() => onEditTime()}>
                    {
                        isEditMode ? <EditRoundedIcon /> : <CheckCircleIcon />
                    }
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
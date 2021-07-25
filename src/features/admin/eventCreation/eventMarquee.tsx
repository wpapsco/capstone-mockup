import { Grid, Fab, TextField } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles";
import RemoveIcon from "@material-ui/icons/Remove";

type EventMarqueeProps = {
    id: number, 
    index: number,
    value: string,
    onRemove: (index: number) => void,
    onChange: (index: number) => any
}

const useStyles = makeStyles({
    textField: {
        margin: "3px",
    },
    icon: {
        float: "right",
    }
})

export default function EventMarquee({id, index, value, onRemove, onChange}: EventMarqueeProps) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={11}>
                <TextField
                    size="small"
                    type="text"
                    label={`Marquee Position ${index + 1}`}
                    onChange={onChange(index)}
                    defaultValue={value}
                    variant="outlined"
                    fullWidth
                    className={classes.textField}
                />
            </Grid>
                <Grid item xs={1}>
                    <Fab
                        size="small"
                        color="secondary"
                        onClick={() => onRemove(id)}     
                        disabled={index === 0}
                        className={classes.icon}
                    >
                        <RemoveIcon />
                    </Fab>
                </Grid>
        </Grid>
    )
}
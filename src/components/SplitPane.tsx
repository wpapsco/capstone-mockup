import { Grid, GridSpacing } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core'

interface SplitPaneProps {
    left: React.ReactNode,
    right: React.ReactNode,
    spacing?: GridSpacing
}
const SplitPane = ({left, right, spacing}: SplitPaneProps) => {
    const classes = useStyles()
    return (
        <Grid container spacing={spacing ? spacing : 2} className={classes.root}>
            <Grid item xs={8}>
                {left}
            </Grid>
            <Grid item xs={4}>
                {right}
            </Grid>
        </Grid>
    )
}

export default SplitPane

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(1),
        minHeight: '100vh',
    },
}))



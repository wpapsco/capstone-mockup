import { Grid, GridSpacing } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'

interface SplitPaneProps {
    left: React.ReactNode,
    right: React.ReactNode,
    spacing?: GridSpacing
}
const SplitPane = ({left, right, spacing}: SplitPaneProps) => {
    const classes = useStyles()
    return (
        <Grid container spacing={spacing ? spacing : 2} style={{marginTop: '30px'}}>
            <Grid item xs={8}>
                {left}
            </Grid>
            <Grid item xs={4}>
                <div className={classes.rightPanel}>
                    {right}
                </div>
            </Grid>
        </Grid>
    )
}

export default SplitPane

const useStyles = makeStyles({
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
})



import { Grid, GridSpacing } from '@material-ui/core'

interface SplitPaneProps {
    left: React.ReactNode,
    right: React.ReactNode,
    spacing?: GridSpacing
}
const SplitPane = ({left, right, spacing}: SplitPaneProps) =>
    <Grid container spacing={spacing ? spacing : 2} style={{marginTop: '30px'}}>
        <Grid item xs={8}>
            {left}
        </Grid>
        <Grid item xs={4}>
            {right}
        </Grid>
    </Grid>

export default SplitPane



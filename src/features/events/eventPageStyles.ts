import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
    cardRoot: {
        display: 'flex',
        height: '400px',
        marginBottom: 40,
    },
    cardContents: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 'auto',
    },
    heroImage: {
        width: '500px',
    },
    cardActions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%',
    },
    formInput: {
        width: '90%',
        textAlign: 'center',
    }
}))
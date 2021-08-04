import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
    cardActions: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    formControl: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '100%',
    },
    formInput: {
        textAlign: 'center',
    },
    calendarSelect: {
        display: "flex",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%"
    },
    changeDateBtnStyle: {
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
        // textDecoration: 'underline',
        padding: theme.spacing(1),
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}))

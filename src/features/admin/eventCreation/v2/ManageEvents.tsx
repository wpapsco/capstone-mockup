import { Button, makeStyles, Theme, Typography } from "@material-ui/core"
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from "react-router"
import { appSelector, useAppDispatch } from "../../../../app/hooks"
import { fetchEventData } from "../../../events/eventsSlice";
import { selectPlaysData, fetchTicketingData } from '../../../ticketing/ticketingSlice'

export default function ManageEventsPage() {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const eventsData = appSelector(selectPlaysData)

    const onEditClick = (id: number|string) => {
        history.push(`/admin/EditEvent/${id}`)
    }
    const onDeleteClick = async (id: any) => {
        const res = await fetch("/api/delete-event", {
           credentials: 'include',
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({id}),
        });
        if (res.ok) {
            dispatch(fetchTicketingData())
            dispatch(fetchEventData())
        }
        else {
            console.error(res.status, res.statusText)
        }
    }

    const columns = [
        { field: "id", headerName: "ID", width: 100},
        { field: "playname", headerName: "Title", width: 200},
        { field: "playdescription", headerName: "Description", width: 200},
        { field: "numShows", headerName: "No. Shows", width: 150},
        { field: "Edit", headerName: "Edit", width: 130, renderCell: (params: any) => (
            <Button variant="contained" color="secondary" onClick={() => onEditClick(params.row.id)}>Edit</Button>
        )},
        { field: "Delete", headerName: "Delete", width: 150, renderCell: (params: any) => (
            <Button variant="contained" color="secondary" onClick={() => onDeleteClick(params.row.id)}>Delete</Button>
        )}
    ]

    return (
        <div className={classes.root}>
            <Typography component='h1' variant='h4'>
                Manage Events
            </Typography>
            
            <DataGrid autoHeight columns={columns} rows={eventsData} pageSize={10} />

            <Button
                className={classes.newEventBtn}
                onClick={() => history.push('/admin/CreateEvents')}
                variant='contained'
                color='primary'
            >
                Create New Event
            </Button>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    root: { marginBottom: theme.spacing(10), '& h1': {marginBottom: theme.spacing(5)} },
    newEventBtn: { marginTop: theme.spacing(5) },
}))
import { Button, makeStyles, Theme, Typography } from "@material-ui/core"
import { useState } from 'react'
import { Backdrop, Fade, Modal, Paper } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import { useHistory } from "react-router"
import { appSelector, useAppDispatch } from "../../../../app/hooks"
import { fetchEventData } from "../../../events/eventsSlice";
import { selectPlaysData, fetchTicketingData } from '../../../ticketing/ticketingSlice'
import { openSnackbar } from "../../../snackbarSlice";

export default function ManageEventsPage() {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const eventsData = appSelector(selectPlaysData)

    const [modalOpen, setModalOpen] = useState(false)
    const [eventToDelete, setEventToDelete] = useState<string|null>()

    const onEditClick = (id: number|string) => {
        history.push(`/admin/EditEvent/${id}`)
    }

    const onDeleteClick = (id: string) => {
        setModalOpen(true)
        setEventToDelete(id)
    }

    const onCancelDelete = () => {
        setEventToDelete(null)
        setModalOpen(false)
    }

    const deleteEvent = async () => {
        setModalOpen(false)
        const res = await fetch("/api/delete-event", {
           credentials: 'include',
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({id: eventToDelete}),
        });
        if (res.ok) {
            dispatch(openSnackbar('Deleted Event'))
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

            <Modal
                className={classes.modal}
                open={modalOpen}
                onClose={onCancelDelete}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={modalOpen}>
                    <Paper className={classes.modalContent}>
                        <Typography>Are you sure you want to delete this?</Typography>
                        <div className={classes.btnGroup}>
                            <Button variant='outlined' onClick={() => deleteEvent()}>
                                Yes
                            </Button>
                            <Button variant='contained' onClick={onCancelDelete}>
                                No, Cancel
                            </Button>
                        </div>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    root: { marginBottom: theme.spacing(10), '& h1': {marginBottom: theme.spacing(5)} },
    newEventBtn: { marginTop: theme.spacing(5) },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        padding: '15px',
    },
    btnGroup: {
        display: 'flex',
        margin: '10px auto',
        justifyContent: 'space-around',
    },
}))
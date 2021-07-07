import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from "react";

// export default function DeleteEvents(props: {}) {
//     return (
//         <div>
//             <h1>Enter Name of Event to Delete</h1>
//             <TextField id="EventName" label="Event Name" variant="outlined" fullWidth/>
//             <button type="button">Delete</button>
//         </div>
//     );
// }

export default function DeleteEvents() {
    function deleteEvent() {
        return;
    }
    const columns = [
        { field: "id", headerName: "Showtime ID", width: 100},
        { field: "playname", headerName: "Play", width: 150},
        { field: "playdescription", headerName: "Play Description", width: 150},
        { field: "eventdate", headerName: "Date", width: 150},
        { field: "starttime", headerName: "Time", width: 100},
        { field: "Delete", headerName: "Delete", width: 150, renderCell: (params: any) => (
            <Button variant="contained" color="secondary" onClick={() => deleteEvent()}>Delete</Button>
        )}
    ]
    const [eventList, setEventList] = useState([]);
    const getEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/event-list");
            const jsonData = await response.json();
            setEventList(jsonData);
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => { getEvents();}, []);
    return (
        <div>
            <Typography variant="h2">Delete Events</Typography>
            <DataGrid autoHeight rows={eventList} columns={columns} pageSize={10}/>
        </div>
    );
}
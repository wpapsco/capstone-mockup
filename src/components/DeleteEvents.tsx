import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from "react";

export default function DeleteEvents() {
    async function deleteEvent() {
        const data = {
            id: selectedRow.id,
            playname: selectedRow.playname,
            playdescription: selectedRow.playdescription,
            eventdate: selectedRow.eventdate,
            starttime: selectedRow.starttime
        }

        const response = await fetch("http://localhost:5000/api/delete-event",
        {
           method: 'POST',
           headers:
           {
              'Content-Type': 'application/json',
           },
           body: JSON.stringify(data),
        });
        return response.json();
    }

    //Add row data to hook
    function onSelection(row:any) {
        const convert =  row.rows[0]
        setSelectedRow(convert);
    }

    //Generate hook structure
    const[selectedRow, setSelectedRow] = useState({
        id: "",
        playname: "",
        playdescription: "",
        eventdate: "",
        starttime: ""
    });

    // Create columns that appears in data
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
            <DataGrid autoHeight rows={eventList} columns={columns} onSelectionModelChange={onSelection} pageSize={10} />
        </div>
    );
}

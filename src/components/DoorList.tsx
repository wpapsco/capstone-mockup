import { CellParams, DataGrid } from '@material-ui/data-grid';
import { Checkbox, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import RequireLogin from './RequireLogin';
import { titleCase } from '../utils';



type DoorListProps = {showid: string}
export default function DoorList() {

    const { showid } = useParams<DoorListProps>()
    const renderCheckbox = ((params: CellParams) => <Checkbox checked={params.value as boolean} />)
    
    const columns = [
        { field: "name", headerName: "Name", width: 150},
        { field: "vip", headerName: "VIP", width: 100, renderCell: renderCheckbox},
        { field: "donor", headerName: "Donor", width: 150, renderCell: renderCheckbox},
        { field: "accomodations", headerName: "Seating Accomodations", width: 240, renderCell: renderCheckbox},
        { field: "num_tickets", headerName: "Tickets", width: 150},
        { field: "arrived", headerName: "Arrived", width: 150, renderCell: (params: any) => (
            <Checkbox color="primary" defaultChecked={(params.value as boolean)} />
        )}
    ]

    const [doorList, setDoorList] = useState([]);
    const [eventName, setEventName] = useState('');
    const getDoorList = async () => {
        try {
            const response = await fetch(`/api/doorlist?showid=${showid}`, {credentials: "include", method: "GET"});
            const jsonData = await response.json();
            setDoorList(jsonData.data);
            setEventName(jsonData.eventname);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => { getDoorList() }, []);
    return (
        <RequireLogin>
            <Typography variant="h2">{`Showing: ${titleCase(eventName)}`}</Typography>
            <Typography gutterBottom variant="h5">5/21/2021 5:00PM</Typography>
            <DataGrid autoHeight rows={doorList} columns={columns} pageSize={10}/>
        </RequireLogin>
    );
}

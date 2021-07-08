import { DataGrid } from '@material-ui/data-grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {useEffect, useState} from 'react';
import RequireLogin from './RequireLogin';

export default function DoorList() {

    const renderCheckbox = ((params: any) => (
        <Checkbox checked={(params.value as boolean)} />
    ))

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
    const getDoorList = async () => {
        try {
            const response = await fetch('/api/doorlist', {credentials: "include", method: "GET"});
            const jsonData = await response.json();
            setDoorList(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => { getDoorList();}, []);
    return (
        <RequireLogin>
            <Typography variant="h2">Showing</Typography>
            <Typography gutterBottom variant="h5">5/21/2021 5:00PM</Typography>
            <DataGrid autoHeight rows={doorList} columns={columns} pageSize={10}/>
        </RequireLogin>
    );
}

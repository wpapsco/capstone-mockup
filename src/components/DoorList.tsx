import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

export default function DoorList() {

    const renderCheckbox = (params: GridCellParams) => (
        <Checkbox checked={(params.value as boolean)} />
    )

    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 150},
        { field: "vip", headerName: "VIP", width: 100, renderCell: renderCheckbox},
        { field: "donor", headerName: "Donor", width: 150, renderCell: renderCheckbox},
        { field: "accomodations", headerName: "Seating Accomodations", width: 240, renderCell: renderCheckbox},
        { field: "num_tickets", headerName: "Tickets", width: 150},
        { field: "arrived", headerName: "Arrived", width: 150, renderCell: params => (
            <Checkbox color="primary" defaultChecked={(params.value as boolean)} />
        )}
    ]

    const rows = [
        { id: 1, name: "John Doe", vip: true, donor: true, accomodations: true, num_tickets: 2, arrived: false },
        { id: 2, name: "John Doe", vip: false, donor: true, accomodations: true, num_tickets: 1, arrived: false },
        { id: 3, name: "John Doe", vip: true, donor: false, accomodations: true, num_tickets: 4, arrived: false },
        { id: 4, name: "John Doe", vip: false, donor: false, accomodations: true, num_tickets: 1, arrived: false },
        { id: 5, name: "John Doe", vip: true, donor: true, accomodations: false, num_tickets: 2, arrived: false },
        { id: 6, name: "John Doe", vip: false, donor: true, accomodations: false, num_tickets: 2, arrived: true },
        { id: 7, name: "John Doe", vip: true, donor: false, accomodations: false, num_tickets: 2, arrived: false },
        { id: 8, name: "John Doe", vip: false, donor: false, accomodations: false, num_tickets: 3, arrived: false },
        { id: 9, name: "John Doe", vip: true, donor: true, accomodations: true, num_tickets: 1, arrived: false },
        { id: 10, name: "John Doe", vip: false, donor: true, accomodations: true, num_tickets: 1, arrived: false },
        { id: 11, name: "John Doe", vip: true, donor: false, accomodations: true, num_tickets: 2, arrived: false },
        { id: 12, name: "John Doe", vip: false, donor: false, accomodations: true, num_tickets: 1, arrived: false },
    ]

    return (
        <div>
            <Typography variant="h2">Showing</Typography>
            <Typography gutterBottom variant="h5">5/21/2021 5:00PM</Typography>
            <DataGrid autoHeight rows={rows} columns={columns} pageSize={10}/>
        </div>
    );
}

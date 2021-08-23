import { DataGrid, GridCellParams } from '@material-ui/data-grid'
import { Checkbox, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RequireLogin from './RequireLogin'
import { titleCase, dayMonthDate, militaryToCivilian } from '../utils'

const renderCheckbox = ((params: GridCellParams) => <Checkbox checked={params.value as boolean} />)

const checkInGuest = async (isCheckedIn: boolean, ticketID: string) => {
    try {
        const res = await fetch(`/api/checkin`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCheckedIn, ticketID })
        })
        return res.json()
    }
    catch (err) {
        console.log(err.message)
    }
}

const renderCheckin = ((params: GridCellParams) =>
    <Checkbox
        color='primary'
        defaultChecked={params.value as boolean}
        onChange={e => checkInGuest(e.target.checked, params.getValue(params.id, 'ticketno') as string)}
    />)

const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "vip", headerName: "VIP", width: 100, renderCell: renderCheckbox },
    { field: "donorbadge", headerName: "Donor", width: 125, renderCell: renderCheckbox },
    { field: "accomodations", headerName: "Accomodations", width: 180, renderCell: renderCheckbox },
    { field: "num_tickets", headerName: "Tickets", width: 130 },
    { field: "arrived", headerName: "Arrived", width: 130, renderCell: renderCheckin },
]

type DoorListProps = {eventinstanceid: string}
export default function DoorList() {

    const { eventinstanceid } = useParams<DoorListProps>()
    const [doorList, setDoorList] = useState([])
    const [eventName, setEventName] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const getDoorList = async () => {
        try {
            const response = await fetch(`/api/doorlist?eventinstanceid=${eventinstanceid}`, {credentials: "include", method: "GET"})
            const jsonData = await response.json()

            // doorlistData.data {id: custid, name, vip, donor: donorbadge, accomodations: seatingaccom, num_tickets, checkedin, ticketno }
            setDoorList(jsonData.data)
            setEventName(jsonData.eventname)
            setDate(dayMonthDate(jsonData.eventdate))
            setTime(militaryToCivilian(jsonData.starttime))
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => { getDoorList() }, [])

    return (
        <RequireLogin>
            <Typography variant="h2">{`Showing: ${titleCase(eventName)}`}</Typography>
            <Typography gutterBottom variant="h5">{`${date}, ${time}`}</Typography>
            <DataGrid
                autoHeight
                disableSelectionOnClick
                rows={doorList}
                columns={columns}
                pageSize={10}/>
        </RequireLogin>
    )
}

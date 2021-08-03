import {Button, TextField} from '@material-ui/core';
import {DataGrid, GridColumns, GridCellParams, GridCellEditCommitParams, MuiEvent} from '@material-ui/data-grid';
import {SyntheticEvent, useEffect, useState} from 'react';


export default function ManageAccounts() {

    const [rows, setRows] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const getAccounts = async () => {
        const r = await fetch('/api/users', {
            credentials: 'include',
            method: 'GET',
        })
        if (r.ok) {
            const accounts = await r.json()
            console.log(accounts)
            setRows(accounts)
        } else {
            console.log('some kind of error')
            setRows([])
        }
    }

    const deleteUser = (userid: number) => async () => {
        const r = await fetch('/api/deleteUser', {
            credentials: 'include',
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: userid})
        })
        if (r.ok)
            await getAccounts()
    }

    const submitNewUser = async () => {
        const r = await fetch('/api/newUser', {
            body: JSON.stringify({username, password}),
            credentials: "include",
            method: 'post',
            headers: {'Content-type': 'application/json'}
        })
        if (r.ok)
            await getAccounts()
    }

    const editUser = async (userid: number, user: {}) => {
        await fetch('/api/changeUser', {
            body: JSON.stringify({id: userid, ...user}),
            credentials: "include",
            method: 'post',
            headers: {'Content-type': 'application/json'}
        })
    }

    const renderButton = (params: GridCellParams) => 
        <Button 
            disabled={!!params.getValue(params.id, 'is_superadmin')} 
            onClick={deleteUser(+params.id.toString())} 
            variant="contained" 
            color="secondary">
                Delete
        </Button>


    const columns: GridColumns = [{
        field: 'id',
        headerName: 'ID',
        width: 100
    }, {
        field: 'username',
        headerName: 'Username',
        width: 150,
        editable: true
    }, {
        field: 'password',
        headerName: 'Password',
        editable: true,
        width: 200,
        valueFormatter: params => params.value || "(Double-click to edit)"

    }, {
        field: 'delete',
        headerName: 'Delete',
        renderCell: renderButton,
        width: 130
    }]

    useEffect(() => {getAccounts()}, [])

    const editCommit = (params: GridCellEditCommitParams, event: MuiEvent<SyntheticEvent<Element, Event>>) => {
        editUser(+params.id.toString(), {[params.field]: params.value})
    }

    return <>
        <div style={{height: 400}}>
            <DataGrid
                columns={columns}
                rows={rows}
                disableSelectionOnClick
                onCellEditCommit={editCommit}
                pageSize={10} />
        </div>
        <TextField value={username} onChange={e => setUsername(e.target.value)} label="username" variant="outlined" />
        <TextField value={password} onChange={e => setPassword(e.target.value)} label="password" variant="outlined" />
        <Button onClick={submitNewUser} variant="contained" color="primary">create user</Button>
    </>
}

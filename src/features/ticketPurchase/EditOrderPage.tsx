import React, { useState } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import { useAppDispatch } from '../../app/hooks'
import { addTicket } from '../cart/cartSlice'
import Cart from '../cart/Cart'

const showNames = ['BBQ Fundraiser', 'Play1', 'Play2']

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);


export default function EditOrderPage() {
    const classes = useStyles()
    const [fullname, setFullname] = useState('')
    const [eventName, selectEvent] = useState('')
    const [boughtConcessions, setConsessions] = useState(false)

    const dispatch = useAppDispatch()

    const handleAddTicket = () => {
        dispatch(addTicket(
            eventName,
            fullname,
            boughtConcessions,
            new Date(Date.now())
        ))
    }

    const handleEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (typeof event.target.value === 'string')
            selectEvent(event.target.value)
    }

    const handleConcessionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (typeof event.target.value === 'string')
            setConsessions(event.target.value === 'Yes' ? true : false)
    }

    return (
        <section>
            <h1>Edit Order</h1>
            <FormControl className={classes.formControl}>
                <InputLabel id="show-label">Shows</InputLabel>
                <Select
                    labelId="show-label"
                    id="show-select"
                    value={eventName}
                    onChange={handleEventChange}
                >
                    {showNames.map(name => <MenuItem value={name}>{name}</MenuItem>)}
                </Select>

                <TextField
                    id='fullname'
                    label='Full Name'
                    value={fullname}
                    onChange={e => setFullname(e.target.value)} />

                <InputLabel id="concessions-label">Concessions</InputLabel>
                <Select
                    labelId="concessions-label"
                    id="concessions-select"
                    value={boughtConcessions ? 'Yes' : 'No'}
                    onChange={handleConcessionsChange}
                >
                    <MenuItem value='Yes'>Yes</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                </Select>
                
                <Button variant='contained' color='primary' onClick={() => handleAddTicket()}>
                    Add Ticket
                </Button>
            </FormControl>
            <Cart />
        </section>
    )
}
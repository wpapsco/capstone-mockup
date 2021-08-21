import { Form } from 'react-final-form'
import { TextField, KeyboardDateTimePicker, Select, Switches } from 'mui-rff'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import DateFnsUtils from "@date-io/date-fns";
import { Button, makeStyles, MenuItem, Theme, Typography } from '@material-ui/core'
import { ValidationErrors } from 'final-form';


// TODO: Get ticket types from DB
interface TicketType {
    id: number,
    name: string,
    price: number,
    concessions: number,
}

export interface NewEventData {
    playname: string,
    playdescription: string,
    isPublished: boolean,
    image_url: string,
    showings: [{
        DateTime: Date,
        ticketType: TicketType,
        totalseats: number
    }]
}

function validate(formData: any): ValidationErrors {
    return (formData.showings?.length > 0) ? undefined : {error: 'Need one or more showings added'}
}

interface EventFormProps {
    onSubmit: (formData: NewEventData) => void
    ticketTypes: TicketType[]
}
export default function EventForm({onSubmit, ticketTypes}: EventFormProps) {
    const classes = useStyles()

    return (
        <Form
            onSubmit={onSubmit}
            mutators={{...arrayMutators}}
            validate={validate}
            render={({
                handleSubmit,
                form: { mutators: { push, pop }},
                pristine,
                submitting,
            }) => (
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField className={classes.field} name='playname' label='Event Title' required={true} />
                    <TextField className={classes.field} name='playdescription' label='Description' />
                    <TextField className={classes.field} name='image_url' label='Image URL' />

                    <Typography variant='h4' component='h2' className={classes.heading}>Showings</Typography>

                    <div className={classes.buttonGroup}>
                        <Button color='secondary' variant='outlined' type='button' onClick={() => push('showings', undefined)}>
                            Add Showing
                        </Button>
                    </div>
                    
                    <FieldArray name='showings'>
                        {({ fields }) =>
                            fields.map((name, i) => (
                                <div key={name} className={classes.showing}>
                                    <label>Show # {i + 1}</label>
                                    <div className={classes.fieldGroup}>
                                        <KeyboardDateTimePicker
                                            name={`${name}.DateTime`}
                                            label='Event Date & Time'
                                            required
                                            dateFunsUtils={DateFnsUtils}
                                        />
                                        <TextField name={`${name}.totalseats`} label='Seating Capacity' type='number' required />
                                        <Select
                                            name={`${name}.ticketType`}
                                            label='Select Ticket Type'
                                            required
                                        >
                                            {ticketTypes.map(t =>
                                                <MenuItem key={t.id} value={t.id}>
                                                    {`${t.name}: ${t.price} (+ ${t.concessions} concessions)`}
                                                </MenuItem>
                                            )}
                                        </Select>
                                    </div>
                                    <span onClick={() => fields.remove(i)}>
                                        Delete
                                    </span>
                                </div>
                            ))
                        }
                    </FieldArray>

                    <Switches
                        label='Publish immediately?'
                        name='isPublished'
                        data={{label: '', value: true}}
                    />

                    <Button className={classes.submitBtn} variant='contained' color='primary' type='submit' disabled={submitting || pristine}>
                        Save New Event
                    </Button>
                </form>
            )}
        />
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
    },
    field: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
    },
    buttonGroup: {
        width: '50%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'space-around',
    },
    showing: {
        margin: `${theme.spacing(2)}px 0`,
        '& span': {
            marginLeft: 'auto',
            cursor: 'pointer'
        }
    },
    fieldGroup: {
        margin: `${theme.spacing(2)}px 0`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > *': {
            margin: `0 ${theme.spacing(1)}px`
        }
    },
    heading: {
        marginTop: theme.spacing(5)
    },
    submitBtn: {
        marginLeft: 'auto',
    }
}))
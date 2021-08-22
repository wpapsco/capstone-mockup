import { Form } from 'react-final-form'
import { TextField, KeyboardDateTimePicker, Select } from 'mui-rff'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import DateFnsUtils from "@date-io/date-fns";
import { Button, makeStyles, MenuItem, Paper, Theme, Typography } from '@material-ui/core'
import { ValidationErrors } from 'final-form';


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
    showings: {
        DateTime: Date,
        ticketTypeId: string,
        totalseats: number
    }[]
}

function validate(formData: any): ValidationErrors {
    return (formData.showings?.length > 0) ? undefined : {error: 'Need one or more showings added'}
}

const initialState = {
    showings: [{
        DateTime: undefined,
        ticketType: undefined,
        totalseats: undefined
    }]
}

interface EventFormProps {
    onSubmit: (formData: NewEventData) => void
    ticketTypes: TicketType[],
    initialValues?: Partial<NewEventData>,
    editMode?: boolean
}
export default function EventForm({onSubmit, ticketTypes, initialValues, editMode}: EventFormProps) {
    const classes = useStyles()

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues ?? initialState}
            mutators={{...arrayMutators}}
            validate={validate}
            render={({
                handleSubmit,
                form: { mutators: { push, pop }},
                pristine,
                submitting,
            }) => (
                <form className={classes.root} onSubmit={handleSubmit}>
                    <Typography variant='h4' component='h2' className={classes.heading}>
                        Event Information
                    </Typography>
                    <TextField className={classes.field} name='playname' label='Event Title' required={true} />
                    <TextField className={classes.field} name='playdescription' label='Description' />
                    <TextField className={classes.field} name='image_url' label='Image URL' />

                    <Typography variant='h4' component='h2' className={classes.heading}>
                        Showings
                    </Typography>
                    <Typography variant='body1'>
                        You can configure occurances of this event below. To add more, click the "Add Showing" button.
                    </Typography>
                    <FieldArray name='showings'>
                        {({ fields }) =>
                            fields.map((name, i) => (
                                <Paper key={name} className={classes.showing}>
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
                                            name={`${name}.ticketTypeId`}
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
                                    <Button onClick={() => fields.remove(i)}>
                                        Delete
                                    </Button>
                                </Paper>
                            ))
                        }
                    </FieldArray>
                    
                    <div className={classes.buttonGroup}>
                        <Button color='secondary' variant='outlined' type='button' onClick={() => push('showings', undefined)}>
                            Add Showing
                        </Button>
                    </div>

                    <Button className={classes.submitBtn} variant='contained' color='primary' type='submit' disabled={submitting || pristine}>
                        {editMode ? 'Save Changes' : 'Save New Event'}
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
        margin: `${theme.spacing(1)}px 0`,
        display: 'flex',
        padding: theme.spacing(2),
        flexDirection: 'column',
        '& > button': { alignSelf: 'end' },
    },
    fieldGroup: {
        margin: `${theme.spacing(2)}px 0`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > *': {
            margin: `0 ${theme.spacing(1)}px`
        },
        '& :first-child': {
            marginLeft: 0
        }
    },
    heading: {
        marginTop: theme.spacing(5)
    },
    submitBtn: {
        marginLeft: 'auto',
    }
}))
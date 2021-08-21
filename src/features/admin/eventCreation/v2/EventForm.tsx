import { Form } from 'react-final-form'
import { TextField, KeyboardDateTimePicker, Select, Switches } from 'mui-rff'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import DateFnsUtils from "@date-io/date-fns";
import { Button, MenuItem, Typography } from '@material-ui/core'
import { ValidationErrors } from 'final-form';


// TODO: Get ticket types from DB
interface TicketType {
    name: string,
    price: number,
    concessions: number,
}

interface NewEventData {
    title: string,
    description: string,
    isPublished: boolean,
    imageUrl: string,
    showings: {DateTime: Date, ticketType: TicketType}
}

function validate(formData: any): ValidationErrors {
    return (formData.showings?.length > 0) ? undefined : {error: 'Need one or more showings added'}
}

interface EventFormProps {
    onSave: (formData: any) => void
}
export default function EventForm({onSave}: EventFormProps) {

    return (
        <Form
            onSubmit={onSave}
            mutators={{...arrayMutators}}
            validate={validate}
            render={({
                handleSubmit,
                form: { mutators: { push, pop }},
                pristine,
                submitting,
            }) => (
                <form onSubmit={handleSubmit}>
                    <TextField name='event-title' label='Event Title' required={true} />
                    <TextField name='description' label='Description' />
                    <TextField name='imageUrl' label='Image URL' />

                    <Typography variant='h3' component='h2'>Showings</Typography>

                    <div>
                        <Button variant='outlined' type='button' onClick={() => push('showings', undefined)}>
                            Add Showing
                        </Button>
                        <Button variant='outlined' type='button' onClick={() => pop('showings')}>
                            Remove Showing
                        </Button>
                    </div>
                    
                    <FieldArray name='showings'>
                        {({ fields }) =>
                            fields.map((name, i) => (
                                <div key={name}>
                                    <label>Show # {i + 1}</label>
                                    <KeyboardDateTimePicker
                                        name={`${name}.DateTime`}
                                        label='Event Date & Time'
                                        required
                                        dateFunsUtils={DateFnsUtils}
                                    />
                                    <TextField name={`${name}.totalseats`} label='Seating Capacity' type='number' required />
                                    <Select name={`${name}.ticketType`} label='Select Ticket Type' required>
                                        <MenuItem value='ticketType0'>General Admission - $15</MenuItem>
                                        <MenuItem value='ticketType1'>General Admission - $20</MenuItem>
                                    </Select>
                                    <span onClick={() => fields.remove(i)} style={{cursor: 'pointer'}}>
                                        X
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

                    <Button variant='contained' color='primary' type='submit' disabled={submitting || pristine}>
                        Save New Event
                    </Button>
                </form>
            )}
        />
    )
}
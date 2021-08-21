import EventForm from './EventForm'


export default function CreateEventPage() {
    const onSave = (formData: any) => {
        console.log('CreateEventPage', formData)
    }

    return (
        <div>
            <h1>Create New Event</h1>
            <EventForm onSave={onSave} />
        </div>
    )
}
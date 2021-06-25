import TextField from '@material-ui/core/TextField';

export default function DeleteEvents(props: {}) {
    return (
        <div>
            <h1>Enter Name of Event to Delete</h1>
            <TextField id="EventName" label="Event Name" variant="outlined" fullWidth/>
            <button type="button">Delete</button>
        </div>
    );
}
import TextField from '@material-ui/core/TextField';

export default function CreateEvents(props: {}) {
    return (
        <div>
            <h1>Enter Event Name</h1>
            <TextField id="Event" label="Event Name" variant="outlined" fullWidth/>
            <h4>Enter Short Event Description</h4>
            <TextField id="EventDescription" label="Event Description" variant="outlined" fullWidth/>
            <h2>Enter Image for Event</h2>
            {/*taken from https://dev.to/asimdahall/client-side-image-upload-in-react-5ffc*/}
            <input type="file" accept="image/*" multiple={false} />
            <h3>Enter Day</h3>
            <TextField id="EventDay" label="Event Day" variant="outlined" fullWidth/>
            <h3>Enter Month</h3>
            <TextField id="EventMonth" label="Event Month" variant="outlined" fullWidth/>
            <h3>Enter Year</h3>
            <TextField id="EventYear" label="Event Year" variant="outlined" fullWidth/>
        </div>
    );
}

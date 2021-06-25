import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';


export default function CreateEvents(props: {}) {
    return (
        <div>
            <h3>Enter Event Name</h3>
            <TextField id="Event" label="Event Name" variant="outlined" fullWidth/>
            <h3>Enter Short Event Description</h3>
            <TextField id="EventDescription" label="Event Description" variant="outlined" fullWidth/>
            <h3>Enter Image for Event</h3>
            {/*taken from https://dev.to/asimdahall/client-side-image-upload-in-react-5ffc*/}
            <input type="file" accept="image/*" multiple={false} />
            <h3>Enter Day</h3>
            <TextField id="EventDay" label="Event Day" variant="outlined" fullWidth/>
            <h3>Enter Month</h3>
            <TextField id="EventMonth" label="Event Month" variant="outlined" fullWidth/>
            <h3>Enter Year</h3>
            <TextField id="EventYear" label="Event Year" variant="outlined" fullWidth/>
            <h3>Enter Season Name</h3>
            <TextField id="SeasonName" label="Season Name" variant="outlined" fullWidth/>
            <h3>Enter Number of Tickets Available</h3>
            <TextField id="NumTicketsAvailable" label="Number of Tickets Available" variant="outlined" fullWidth/>
            <h3>To Delete An Event click the Link Below</h3>
            <Link to="/DeleteEvents">Go To Event Deletion Page</Link>
        </div>
    );
}

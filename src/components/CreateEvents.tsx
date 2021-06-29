import { TextField, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function CreateEvents(props: {}) {
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventTickets, setEventTickets] = useState(0);
  const [eventDate, setEventDate] = useState(new Date()); // Use React datetime??
  const [eventTime, setEventTime] = useState(eventDate.getTime()); // Use React datetime??

  const eventCreate = async () => {
    console.log("EventName: ", eventName);

    const data = {
      eventName: eventName,
      eventDesc: eventDesc,
      eventTickets: eventTickets,
      eventDate: eventDate,
      eventTime: eventTime,
    };

    const req = await fetch("http://localhost:5000/api/create-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return req.json();
  };

  return (
    <div>
      <h3>Enter Event Name</h3>
      <TextField
        id="Event"
        label="Event Name"
        variant="outlined"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
          setEventName(ev.target.value)
        }
        fullWidth
      />
      <h3>Enter Short Event Description</h3>
      <TextField
        id="EventDescription"
        label="Event Description"
        variant="outlined"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
          setEventDesc(ev.target.value)
        }
        fullWidth
      />
      <h3>Enter Image for Event</h3>
      {/*taken from https://dev.to/asimdahall/client-side-image-upload-in-react-5ffc*/}
      <input type="file" accept="image/*" multiple={false} />

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h3>Enter Date</h3>
          <TextField type="date" id="eventDate" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <h3>Enter Time</h3>
          <TextField type="time" id="eventtime" variant="outlined" fullWidth />
        </Grid>
      </Grid>
      {/*       
      <TextField id="EventDay" label="Event Day" variant="outlined" fullWidth />
      <h3>Enter Month</h3>
      <TextField
        id="EventMonth"
        label="Event Month"
        variant="outlined"
        fullWidth
      />
      <h3>Enter Year</h3>
      <TextField
        id="EventYear"
        label="Event Year"
        variant="outlined"
        fullWidth
      />
      <h3>Enter Season Name</h3>
      <TextField
        id="SeasonName"
        label="Season Name"
        variant="outlined"
        fullWidth
      /> */}

      <h3>Enter Number of Tickets Available</h3>
      <TextField
        id="NumTicketsAvailable"
        label="Number of Tickets Available"
        variant="outlined"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
          setEventTickets(parseInt(ev.target.value, 10))
        }
        fullWidth
      />
      <Button variant="contained" type="submit" onClick={eventCreate}>
        Submit
      </Button>
      <h3>To Delete An Event click the Link Below</h3>
      <Link to="/DeleteEvents">Go To Event Deletion Page</Link>
    </div>
  );
}

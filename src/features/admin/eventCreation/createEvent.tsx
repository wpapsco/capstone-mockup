import React, { useState } from "react";
import { Grid, TextField, Fab, Button } from "@material-ui/core";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";

import EventMarquee from "./eventMarquee";
import ImageUploader from "./ImageUploader";
//import EventLocation from "./location";

type NewEventProps = {
    eventSaved: () => void,
    eventTitle: (title: string) => void,
}

const useStyles = makeStyles({
    description: {
        width: "100%",
        fontSize: "16px"
    }
})

export default function NewEvent({eventSaved, eventTitle} : NewEventProps) {
    const classes = useStyles();
    const [title, setTitle] = useState("");
    const [marquee, setMarquee] = useState([{ id: 0, value: "" }]);
    const [description, setDescription] = useState("");
    const [id, setId] = useState(1); // Needs to be set 1 more than marquee.id
    const [eventImage, setEventImage] = useState({});
    // TODO (Greg) are we using a location??
    // This should be fetched from the server
    const [location, setLocation] = useState(
    "Portland Playhouse, 602 NW Prescott St., Portland, OR, 97211"
    );

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.currentTarget.value);
    }

    const addNewMarquee = () => {
        setMarquee([...marquee, { id: id, value: "" }]);
        setId(id + 1);
    };

    const removeMarquee = (idx: number) => {
        const rest = marquee.filter((each) => each.id !== idx);
        setMarquee(rest);
    };

    const onMarqueeChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Received: ' + e.currentTarget.value);
        let newHeaders = [...marquee];
        newHeaders[idx].value = e.currentTarget.value;
        setMarquee(newHeaders);
    };

    const onImageChange = (f: File | undefined) => {
        if (f !== undefined)
            setEventImage(f);
    }

    const submitNewEvent = () => {
        console.log('Event submitted: ' + title + ' ' + description + ' -- Marquee: ' + marquee);
        // TODO(Greg) send new event to server, get response. We should really get the UUID from the
        // server and set the title using that. Change below
        eventTitle(title);
        eventSaved();
    }

    return (
        <div style={{ marginTop: "3em" }}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <TextField
                id="title"
                label="Title"
                variant="outlined"
                onChange={onTitleChange}
                required
                fullWidth
            />
            </Grid>
            <Grid item xs={12} style={{ display: "inline-block" }}>
                <Grid container spacing={3}>
                    <Grid item>
                    <p>Marquee information</p>
                    </Grid>
                    <Grid item>
                    <Fab
                        size="small"
                        color="primary"
                        aria-label="add"
                        onClick={addNewMarquee}
                    >
                        <AddIcon />
                    </Fab>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {
                    marquee.map((m, index) => {
                        return (
                            <EventMarquee
                                key={m.id}
                                id={m.id}
                                index={index}
                                value={m.value}
                                onRemove={removeMarquee}
                                onChange={onMarqueeChange}
                            />
                        );
                    })
                }
            </Grid>
            <Grid item xs={12}>
            <TextareaAutosize
                id="description"
                rowsMin={4}
                onChange={onDescriptionChange}
                placeholder="Description"
                required
                className={classes.description}
            />
            </Grid>
            <Grid item xs={12}>
                <ImageUploader setImageObj={onImageChange} />
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" color="primary" size="small" endIcon={<SaveIcon />} onClick={submitNewEvent}>
                    Save Event
                </Button>
            </Grid>
        </Grid>
        </div>
    );
}
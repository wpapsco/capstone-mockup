import { useState } from "react";

import EventTimes from "./eventTimes";
import NewEvent from "./createEvent";

export default function NewEventMain() {
    const [currentEvent, setCurrentEvent] = useState(false);
    const [eventTitle, setEventTitle] = useState("");

    const onEventSaved = () => {
        setCurrentEvent(true);
    }

    const onEventTitleChange = (title: string) => {
        setEventTitle(title);
    }

    return (
        <>
        {currentEvent ? <EventTimes eventTitle={eventTitle}/> : <NewEvent eventSaved={onEventSaved} eventTitle={onEventTitleChange}/> }
        </>
    )
}

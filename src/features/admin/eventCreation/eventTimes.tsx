import { useState, useEffect } from "react";
import { Grid, Fab, RadioGroup, FormControl } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTable from "./CalendarTable";
import EventTimePicker from "./EventTimePicker";
import ShowTimeListing from "./ShowTimeListing";

interface EventDetails {
    id: number,
    playid: number,
    showid: number,
    eventName: string,
    eventDate: Date,
    eventTime: string,
    seats: number,
    price: number,
}

type ShowTimesProps = {
    eventTitle: string,
    eventDetails: EventDetails[],
}

interface ShowTimeSelector {
    id: number,
    time: string,
    seats: number,
    current: boolean,
}

export default function EventTimes({ eventTitle, eventDetails } : ShowTimesProps) {
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    // We need at least one
    const [showTimes, setShowTimes] = useState<ShowTimeSelector[]>([]);
    // TODO: Change this v
    const colors = ["aqua", "crimson", "forestgreen", "blue", "deeppink", "greenyellow", "indigo", "maroon", "steelblue"];

    const setUpTimes = () => {
        let times: ShowTimeSelector[] = [];
        eventDetails.forEach((val) => {
            console.log('Found!')
            const found = times.find(ele => ele.time === val.eventTime);
            if (!found) {
                times.push({ id: times.length, time: val.eventTime.slice(0,6), seats: val.seats, current: times.length === 0 ? true : false })
            }
        })

        if (times.length === 0) {
            times.push({ id: 0, time: "", seats: 0, current: true });
        }
        setShowTimes(times);

        console.log("Times: " + times.length + " Event: " + eventDetails.length)
    }
 
    useEffect(() => {
       setUpTimes();
    }, [eventDetails])

    // Increment the calendar month
    const onMonthIncr = () => {
        const newMonth = calendarMonth + 1;
        if (newMonth % 12 === 0) {
            setCalendarMonth(0);
            setCalendarYear(calendarYear + 1);
        } else {
            setCalendarMonth(newMonth);
        }
    };

    // Decerment calendar month
    const onMonthDecr = () => {
        const newMonth = calendarMonth - 1;
        if (newMonth < 0) {
            setCalendarMonth(11);
            setCalendarYear(calendarYear - 1);
        } else {
            setCalendarMonth(newMonth);
        }
    };

    // onSelectDayOfWeek:
    // If the user selects the top calendar bar where the days of the week are listed
    // we get a callback here.
    // 
    // TODO (Greg)
    const onSelectDayOfWeek = (dayOfWeek: number) => {
        console.log(`The day ${dayOfWeek} was clicked`);
    }

    // onSelectDay:
    // When the user selects a specific day of the month to add a show time to
    // we register it here.
    // 
    // key: The index from the month table
    // fullDate: The full date as if gotten from getDate(year, month, day). No time 
    //      information.
    const onSelectDay = (key: number, fullDate: Date | null) => {
        if (fullDate !== null) {
            // Get the currently selected time information
            let i = 0;
            for (; i < showTimes.length; i++) {
                if (showTimes[i].current)
                    break;
            }
            console.log('Date is: ' + fullDate + ' time is :' + showTimes[i].time);
        }
    }

    // Add a show time to the list
    const onNewShowTimes = () => {
        let st = showTimes.slice();
        let id = showTimes.length;
        st.push({id: id, time: "", seats: 0, current: false});
        setShowTimes(st);
        console.log('Setting showtimes: ' + showTimes.length);
    }

    // Change one of the current show times on the list
    const onAddShowTime = (time: string, seats: number, index: number) => {
        console.log("Time: " + time + " seats: " + seats + " id: " + index + ' Length: ' + showTimes.length);
        let times = showTimes.slice();
        times[index] = {id: times[index].id, time: time, seats: seats, current: times[index].current};
        setShowTimes(times);

    }

    // TODO: What if the currently selected show time is the one being deleted?
    // We need to change that. 
    const onRemoveShowTime = (index: number) => {
        let showTime = showTimes.slice();
        showTime.splice(index, 1);
        setShowTimes(showTime);
    }

    // Called when the user selects a different time
    const onChangeSelectedTime = (index: number) => {
        let st = showTimes.slice()
        st.forEach(ele => ele.current = false);
        st[index].current = true;
        setShowTimes(st);
    }

    return (
        <div>
            <Grid container style={{ marginTop: "20px" }}>
                <Grid item xs={6}>
                    <h3><em>{ eventTitle }</em> details</h3>
                </Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={1}>
                    <Fab size="small" onClick={onNewShowTimes}>
                        <AddIcon />
                    </Fab>
                </Grid>
            </Grid>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup name="radio-button-group">
                    {
                        showTimes.map((value, index) => {
                            return <EventTimePicker 
                                key={ value.id } 
                                id={ index } 
                                eventTime={ value.time }
                                eventSeats={ value.seats }
                                checked={ value.current }
                                color={ colors[index] } 
                                onAddTime={ onAddShowTime } 
                                onRemoveTime={ onRemoveShowTime } 
                                onChangeTime={ onChangeSelectedTime }
                            />;
                        })
                    }
                </RadioGroup>
            </FormControl>
            <CalendarTable 
                targetMonth={calendarMonth} 
                targetYear={calendarYear} 
                onSelectDaysOfWeek={onSelectDayOfWeek}
                onSelectDay={onSelectDay}
                onMonthDecr={onMonthDecr}
                onMonthIncr={onMonthIncr}
                key={calendarMonth}
            />
            <div>
                {
                    eventDetails.length > 0 ? eventDetails.map((val, index) => {
                        return <ShowTimeListing 
                            key={ index } 
                            id={ val.id } 
                            eventDate={ val.eventDate } 
                            startTime={ val.eventTime } 
                            totalSeats={ val.seats }
                        />
                    }) : ""
                }
            </div>
        </div>
    )
}
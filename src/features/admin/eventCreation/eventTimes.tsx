import { useState, useEffect } from "react";
import { Grid, Fab, RadioGroup, FormControl, Select, MenuItem, InputLabel, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTable from "./CalendarTable";
import EventTimePicker from "./EventTimePicker";
import ShowTimeListing from "./ShowTimeListing";

type EventDates = {
    id: number,
    date: Date,
    seats: number,
}

const useStyles = makeStyles({
    formListSelector: {
        minWidth: 120,
    }
})

export default function EventTimes({eventTitle}: {eventTitle: string}) {
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const [showTimes, setShowTimes] = useState([{time: "", seats: 0, current: true}]);
    const [showList, setShowList] = useState([eventTitle, "one", "two"]); // TODO this should be fetched from API
    const [showListOpen, setShowListOpen] = useState(false);
    const colors = ["aqua", "crimson", "forestgreen", "blue", "deeppink", "greenyellow", "indigo", "maroon", "steelblue"];
    const classes = useStyles();

    useEffect(() => {
        
    });
    
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

    /* onSelectDayOfWeek:
     * If the user selects the top calendar bar where the days of the week are listed
     * we get a callback here.
     * 
     * TODO (Greg)
     */
    const onSelectDayOfWeek = (dayOfWeek: number) => {
        console.log(`The day ${dayOfWeek} was clicked`);
    }

    /* onSelectDay:
     * When the user selects a specific day of the month to add a show time to
     * we register it here.
     * 
     * key: The index from the month table
     * fullDate: The full date as if gotten from getDate(year, month, day). No time 
     *      information.
     */
    const onSelectDay = (key: number, fullDate: Date | null) => {
        if (fullDate !== null) {
            // Get the currently selected time information
            let i = 0;
            for (; i < showTimes.length; i++) {
                console.log(`${i} -- Time: ${showTimes[i].time} -- Seats: ${showTimes[i].seats} -- Current: ${showTimes[i].current}`);
                if (showTimes[i].current)
                        break;
            }

            // Set the date and time to specified.
            const t = showTimes[i].time.split(':');
            fullDate.setHours(+t[0], +t[1]);
            console.log(`Key: ${key} I: ${i} FullDate: ${fullDate} Seats: ${showTimes[i].seats} Time: ${showTimes[i].time} Length: ${showTimes.length}`);
        }
    }

    // Add a show time to the list
    const onNewShowTimes = () => {
        let st = showTimes.slice();
        st.push({time: "", seats: 0, current: false});
        setShowTimes(st);
        console.log('Setting showtimes: ' + showTimes.length);
    }

    // Change one of the current show times on the list
    const onAddShowTime = (time: string, seats: number, index: number) => {
        console.log("Time: " + time + " seats: " + seats + " id: " + index + ' Length: ' + showTimes.length);
        let times = showTimes.slice();
        times[index] = {time: time, seats: seats, current: times[index].current};
        setShowTimes(times);

    }

    // TODO: What if the currently selected show time is the one being deleted?
    // We need to change that. 
    const onRemoveShowTime = (index: number) => {
        let showTime = showTimes.slice();
        showTime.splice(index, 1);
        setShowTimes(showTime);
    }

    const onChangeSelectedTime = (index: number) => {
        let st = showTimes.slice()
        st.forEach(ele => ele.current = false);
        st[index].current = true;
        setShowTimes(st);
    }

    const onShowListOpen = () => {
        setShowListOpen(true);
    }

    const onShowListClose = () => {
        setShowListOpen(false);
    }

    const onShowListChange = () => {
        // TODO
    }

    const getInfo = () => {
        console.log(`ShowTime Length: ${showTimes.length}`);
        for (let i = 0; i < showTimes.length; i++) {
            console.log(`${i} -- Time: ${showTimes[i].time} -- Seats: ${showTimes[i].seats} -- Current: ${showTimes[i].current}`);
        }
    }

    return (
        <div>
            <button onClick={getInfo}>Get Info</button>
            <Grid container style={{ marginTop: "20px" }}>
                <Grid item xs={6}>
                    <h3>Create show times</h3>
                </Grid>
                <Grid item xs={4}>
                    <FormControl className={classes.formListSelector}>
                        <InputLabel>Show</InputLabel>
                        <Select 
                            open={showListOpen}
                            onClose={onShowListClose}
                            onOpen={onShowListOpen}
                            onChange={onShowListChange}
                        >
                            <MenuItem defaultValue  =""></MenuItem>
                            {
                                showList.map((value, index) => {
                                    return (
                                        <MenuItem value={index}>{ value }</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
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
                                key={index} 
                                id={index} 
                                checked={value.current}
                                color={colors[index]} 
                                onAddTime={onAddShowTime} 
                                onRemoveTime={onRemoveShowTime} 
                                onChangeTime={onChangeSelectedTime}
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
                <ShowTimeListing />
            </div>
        </div>
    )
}
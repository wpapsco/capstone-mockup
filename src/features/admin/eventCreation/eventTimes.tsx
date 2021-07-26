import { useState } from "react";
import { Grid, Fab, RadioGroup, FormControl } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTable from "./CalendarTable";
import EventTimePicker from "./EventTimePicker";
import ShowTimeListing from "./ShowTimeListing";

type EventDates = {
    id: number,
    date: Date,
    seats: number,
}

export default function EventTimes({eventTitle}: {eventTitle: string}) {
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const [showTimes, setShowTimes] = useState([{time: "", seats: 0, current: true}]);
    const colors = ["aqua", "crimson", "forestgreen", "blue", "deeppink", "greenyellow", "indigo", "maroon", "steelblue"];
    
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

    const onSelectDayOfWeek = (dayOfWeek: number) => {
        console.log(`The day ${dayOfWeek} was clicked`)
    }

    const onSelectDay = (key: number, fullDate: Date | null) => {
        if (fullDate !== null)
            console.log(`Key: ${key} FullDate: ${fullDate}`);
    }

    const onNewShowTimes = () => {
        setShowTimes([...showTimes, {time: "", seats: 0, current: false}]);
    }

    const onAddShowTime = (time: string, seats: number, index: number) => {
        console.log("Time: " + time + " seats: " + seats );
    }

    const onRemoveShowTime = (index: number) => {
        let showTime = [...showTimes];
        showTime.splice(index, 1);
        setShowTimes(showTime);
    }

    const onChangeSelectedTime = (index: number) => {
        let st = [...showTimes];
        st.forEach(ele => ele.current = false);
        st[index].current = true;
        setShowTimes(st);
    }

    return (
        <div>
            <Grid container style={{ marginTop: "20px" }}>
                <Grid item xs={6}>
                    <h3>Create show times</h3>
                </Grid>
                <Grid item xs={4}></Grid>
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
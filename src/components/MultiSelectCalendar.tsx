import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import isSameDay from "date-fns/isSameDay";
import {useState} from "react";
import {createStyles, IconButton} from "@material-ui/core";
import format from "date-fns/format";
import {withStyles} from "@material-ui/styles";
import clsx from 'clsx';

function MultiSelectCalendar({ classes, value, onChange}: {classes: any, value?: Date[], onChange?: (a: Date[]) => void}) {

    const [dates, setDates] = useState<Date[]>([]);
    const [selDate, setSelDate] = useState<Date>(new Date());
    let updateDate = true;

    const handleChange = (date: MaterialUiPickersDate) => {
        if (!date) return;
        setSelDate(date)
        if (updateDate) {
            toggleDate(date)
            updateDate = true;
        }
    }

    const toggleDate = (date: Date) => {
        const idx = dates.findIndex(d => isSameDay(d, date))
        if (idx == -1) {
            setDates([date, ...dates]);
        } else {
            setDates(dates.slice(0, idx).concat(dates.slice(idx + 1)));
        }

        if (!value || !onChange) return;
        const _idx = value.findIndex(d => isSameDay(d, date))
        if (idx == -1) {
            onChange([date, ...value])
        } else {
            onChange(value.slice(0, _idx).concat(value.slice(_idx + 1)))
        }
    }

    return <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                variant="static"
                openTo="date"
                orientation="landscape"
                value={selDate}
                onChange={handleChange}
                onYearChange={date => {
                    if (!date) return;
                    console.log("yearchange", date)
                    updateDate = false;
                }}
                renderDay={(day, selectedDate, dayInCurrentMonth, dayComponent) => {
                    if (!day) return <div />
                    const wrapperClassName = clsx({
                        [classes.highlight]: (value || dates).some(d => isSameDay(d, day))
                    })
                    return <div className={wrapperClassName}>
                        <IconButton className={classes.day}>
                            <span> {format(day, "d")} </span>
                        </IconButton>
                    </div>
                }}
            />
        </MuiPickersUtilsProvider>
    </>
}

const styles = createStyles((theme: any) => ({
    dayWrapper: {
        position: "relative",
    },
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: "0 2px",
        color: "inherit",
    },
    customDayHighlight: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "2px",
        right: "2px",
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "50%",
    },
    nonCurrentMonthDay: {
        color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
        color: "#676767",
    },
    highlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    }
}))

export default withStyles(styles)(MultiSelectCalendar);

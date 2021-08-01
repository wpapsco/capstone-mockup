import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import isSameDay from "date-fns/isSameDay";
import {useState} from "react";
import {IconButton, makeStyles} from "@material-ui/core";
import format from "date-fns/format";
import clsx from 'clsx';
import {DatePickerToolbar} from "@material-ui/pickers/DatePicker/DatePickerToolbar";

const useStyles = makeStyles(theme => ({
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: "0 2px",
        color: "inherit",
    },
    nonCurrentMonthDay: {
        color: theme.palette.text.disabled,
    },
    selectedNonCurrentMonthDay: {
        color: theme.palette.common.white
    },
    wrapper: {
        background: "inherit",
        color: theme.palette.common.white,
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    },
    highlight: {
        background: theme.palette.primary.main,
    },
    highlightOutside: {
        background: theme.palette.primary.dark,
    }
}))

export type MultiSelectCalendarProps = {
    value?: Date[],
    onChange?: (a: Date[]) => void,
    disabled?: boolean,
    onDateClicked?: (date: Date) => void,
    bindDates?: boolean
}
function MultiSelectCalendar({value, onChange, disabled, onDateClicked, bindDates}: MultiSelectCalendarProps) {

    const [dates, setDates] = useState<Date[]>([]);
    let startDate = new Date()
    if (value) {
        startDate = value[0]
    }
    const [selDate, setSelDate] = useState<Date>(startDate);
    let updateDate = true;
    const classes = useStyles();

    const handleChange = (date: MaterialUiPickersDate) => {
        if (!date) return;
        setSelDate(date)
        if (updateDate) {
            toggleDate(date)
        } else {
            updateDate = true
        }
    }

    const toggleDate = (date: Date) => {
        if (onDateClicked) onDateClicked(date)
        if (disabled) return
        const idx = dates.findIndex(d => isSameDay(d, date))
        if (idx === -1) {
            setDates([date, ...dates]);
        } else {
            setDates(dates.slice(0, idx).concat(dates.slice(idx + 1)));
        }

        if (!value || !onChange) return;
        const _idx = value.findIndex(d => isSameDay(d, date))
        if (idx === -1) {
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
                    updateDate = false;
                }}
                minDate={!bindDates || !value ? undefined : value.reduce((a, b) => a < b ? a : b)}
                maxDate={!bindDates || !value ? undefined : value.reduce((a, b) => a > b ? a : b)}
                disableToolbar={bindDates}
                renderDay={(day, selectedDate, dayInCurrentMonth, dayComponent) => {
                    if (!day) return <div />
                    const daySelected = (value || dates).some(d => isSameDay(d, day))
                    const wrapperClassName = clsx({
                        [classes.wrapper]: daySelected,
                        [classes.highlight]: daySelected && dayInCurrentMonth,
                        [classes.highlightOutside]: daySelected && !dayInCurrentMonth
                    })
                    const dayClassName = clsx(classes.day, {
                        [classes.nonCurrentMonthDay]: !dayInCurrentMonth && !daySelected,
                        [classes.selectedNonCurrentMonthDay]: !dayInCurrentMonth && daySelected
                    });
                    return <div className={wrapperClassName}>
                        <IconButton className={dayClassName}>
                            <span> {format(day, "d")} </span>
                        </IconButton>
                    </div>
                }}
            />
        </MuiPickersUtilsProvider>
    </>
}
export default MultiSelectCalendar;

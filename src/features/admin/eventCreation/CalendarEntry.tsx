import TableCell from "@material-ui/core/TableCell";

type CalendarEntryProps = {
    day: number,
    calKey: number,
    onCalendarClick: (key: number, fullDate: Date | null) => void,
    fullDate: Date | null
}

export default function CalendarEntry({day, calKey, onCalendarClick, fullDate} : CalendarEntryProps) {

    return (
        <TableCell
            align="center"
            key={calKey}
            onClick={() => onCalendarClick(calKey, fullDate)}
            style={{ cursor: "pointer" }}
        >
            {day === 0 ? "" : day}
        </TableCell>
    )
}
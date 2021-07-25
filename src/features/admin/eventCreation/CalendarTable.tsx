import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    Fab,
    Paper,
    Grid,
    makeStyles
} from "@material-ui/core";
import NavigationBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CalendarEntry from './CalendarEntry';

type CalendarTableProps = {
    targetMonth: number,
    targetYear: number,
    onSelectDaysOfWeek: (dayOfWeek: number) => any,
    onSelectDay: (key: number, fullDate: Date | null) => any,
    onMonthDecr: () => any,
    onMonthIncr: () => any,
}

const useStyles = makeStyles({
    calHeader: {
        marginTop: "20px"
    },
    headerBtns: {
        alignItems: "flex-end"
    }
})

export default function CalendarTable({targetMonth, targetYear, onSelectDaysOfWeek, onSelectDay, onMonthDecr, onMonthIncr} : CalendarTableProps) {
    const classes = useStyles();
    const [monthTable, setMonthTable] = useState<any>([]);
    const [monthName, setMonthName] = useState("");

    useEffect(() => {
        makeCalendarTable();
    }, []);

    const makeCalendarTable = () => {
        let month = targetMonth;
        let year = targetYear;
        let dt = new Date(year, month);
        let table = [];

        setMonthName(Intl.DateTimeFormat("en-us", { month: "long"}).format(new Date(targetYear, targetMonth)));

        for (let i = 0; i < dt.getDay(); i++) {
            table.push(
                <CalendarEntry
                    calKey={table.length}
                    day={0}
                    fullDate={null}
                    onCalendarClick={onSelectDay}
                />
            )
        }

        while (dt.getMonth() === month) {
            table.push(
                <CalendarEntry
                    calKey={table.length}
                    day={dt.getDate()}
                    fullDate={new Date(year, month, dt.getDate())}
                    onCalendarClick={onSelectDay}
                />
            )
            dt.setDate(dt.getDate() + 1);
        }

        if (dt.getDate() !== 0) {
            for (let i = 0; i < 7; i++) {
                table.push(
                    <CalendarEntry
                        calKey={table.length}
                        day={0}
                        fullDate={null}
                        onCalendarClick={onSelectDay}
                    />
                )
            }
        }
        setMonthTable(table);
    }

    return(
        <>
            <Grid container className={classes.calHeader}>
                <Grid item xs={6}>
                    <h3>{monthName} {targetYear}</h3>
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={2} className={classes.headerBtns}>
                    <Fab size="small" onClick={onMonthDecr}><NavigationBeforeIcon /></Fab>
                    <Fab size="small" onClick={onMonthIncr}><NavigateNextIcon /></Fab>
                </Grid>
            </Grid>
            <TableContainer component={Paper} key={targetMonth}>
                <Table aria-label="Calendar">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(0)}>Sunday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(1)}>Monday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(2)}>Tuesday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(3)}>Wednesday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(4)}>Thursday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(5)}>Friday</TableCell>
                            <TableCell style={{ cursor: "pointer" }} align="center" onClick={() => onSelectDaysOfWeek(6)}>Saturday</TableCell>
                        </TableRow>
                    </TableHead>   
                    <TableBody>
                        <TableRow>{monthTable.slice(0, 7)}</TableRow>     
                        <TableRow>{monthTable.slice(7, 14)}</TableRow>     
                        <TableRow>{monthTable.slice(14, 21)}</TableRow>     
                        <TableRow>{monthTable.slice(21, 28)}</TableRow>     
                        <TableRow>{monthTable.slice(28, 35)}</TableRow>     
                    </TableBody>                 
                </Table>
            </TableContainer>
        </>
    )
}
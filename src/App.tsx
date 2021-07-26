import { useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme'
import CheckoutPage from "./components/CheckoutPage";

import Navbar from './app/Navbar';
import {
     Switch,
     Route,
} from 'react-router-dom';
import Cart from './features/cart/Cart';
import NewsletterSignup from "./features/newsletter/NewsletterSignup";
import CheckoutSuccess from "./components/CheckoutSuccess";
import { Button, Container } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { useAppDispatch, appSelector } from './app/hooks'
import { closeSnackbar, selectSnackbar } from "./features/snackbarSlice"

import AllEventsPage from './features/events/AllEventsPage'
import EventPage from "./features/events/EventPage"
import { fetchEventData } from "./features/events/eventsSlice";
import { fetchTicketingData } from './features/ticketing/ticketingSlice'

import LoginPage from "./components/LoginPage";
import AdminSwitch from "./features/admin/AdminSwitch";
import RequireLogin from "./components/RequireLogin";
import MultiSelectCalendar from "./components/MultiSelectCalendar";

function App() {

    const dispatch = useAppDispatch()
    const snackbarState = appSelector(selectSnackbar)
    const eventsStatus = appSelector(state => state.events.status)

    useEffect(() => {
        if(eventsStatus === 'idle') {
            dispatch(fetchEventData())
            dispatch(fetchTicketingData())
        }
    }, [dispatch])

    const onSnackbarClose = (_: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        dispatch(closeSnackbar())
    }

    const [dates, setDates] = useState<Date[]>([])

    return (
        <Container maxWidth="md">
            <ThemeProvider theme={theme}>
                <div id="maincontainer">
                    <Navbar />
                    <Switch>
                        <Route path="/testcalendar">
                            <MultiSelectCalendar value={dates} onChange={setDates}/>
                            <Button onClick={() => setDates([])}>Clear</Button>
                            {dates.map(d => <p>{d.toLocaleString()}</p>)}
                        </Route>
                        <Route path="/events/:playid">
                            <EventPage />
                        </Route>

                        <Route path="/success">
                            <CheckoutSuccess/>
                        </Route>

                        <Route exact path="/">
                            <AllEventsPage />
                        </Route>

                        <Route exact path="/events">
                            <AllEventsPage />
                        </Route>

                        <Route path="/cart">
                            <Cart />
                        </Route>

                        <Route path="/completeorder">
                            <CheckoutPage/>
                        </Route>

                        <Route path="/newsletter_signup">
                            <NewsletterSignup />
                        </Route>

                        <Route path="/login/:redirect?" >
                            <LoginPage />
                        </Route>
                        
                        <Route path="/admin">
                            <RequireLogin redirectTo="/admin">
                                <AdminSwitch />
                            </RequireLogin>
                        </Route>

                    </Switch>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackbarState.shown}
                    autoHideDuration={6000}
                    onClose={onSnackbarClose}
                    message={snackbarState.message}/>
            </ThemeProvider>
        </Container>
    );
}

export default App;

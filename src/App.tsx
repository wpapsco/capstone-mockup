import { useState } from "react";
import "./App.css";
import ShowingsPage from "./components/ShowingsPage";
import CheckoutPage from "./components/CheckoutPage";
import DoorList from "./components/DoorList";
import CreateEvents from "./components/CreateEvents";
import DeleteEvents from "./components/DeleteEvents";
import CssBaseline from '@material-ui/core/CssBaseline';
import AdminPannel from "./features/admin/AdminPanel";
import Button from '@material-ui/core/Button';
import Navbar from './app/Navbar';
import {
     Switch,
     Route,
     Redirect,
} from 'react-router-dom';
import EditOrderPage from "./features/checkout/EditOrderPage";
import Cart from './features/cart/Cart';
import EventPage from './features/events/EventPage'
import AllEventsPage from "./features/events/AllEventsPage";
import NewsletterPage from "./features/newsletter/NewsletterPage";
import CheckoutSuccess from "./components/CheckoutSuccess";
import { Container } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { useAppDispatch, appSelector } from './app/hooks'
import { closeSnackbar, selectSnackbar } from "./features/snackbarSlice"

function App() {

    const [doorList, setDoorList] = useState(false);
    const dispatch = useAppDispatch()
    const snackbarState = appSelector(selectSnackbar)

    const onSnackbarClose = (_: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        dispatch(closeSnackbar())
    }

    const showings = <ShowingsPage showingSelected={() => setDoorList(!doorList)} />;

    return (
        <Container maxWidth="md">
            <div id="maincontainer">
                <Navbar />
                <Switch>
                    <Route path="/events/:id">
                        <EventPage />
                    </Route>
                    <Route path="/events/:id">
                        <EventPage />
                    </Route>

                    <Route path="/events/:id">
                        <EventPage />
                    </Route>

                    <Route path="/success">
                        <CheckoutSuccess/>
                    </Route>

                    <Route path="/events">
                        <AllEventsPage />
                    </Route>

                    <Route path="/order">
                        <EditOrderPage />
                    </Route>

                    <Route path="/cart">
                        <Cart />
                    </Route>

                    <Route path="/completeorder">
                        <CheckoutPage/>
                    </Route>

                    <Route path="/CreateEvents">
                        <CreateEvents />
                    </Route>

                    <Route path="/DeleteEvents">
                        <DeleteEvents />
                    </Route>

                    <Route path="/newsletter">
                        <NewsletterPage />
                    </Route>

                    <Route path="/admin/admin-panel">
                        <AdminPannel />
                    </Route>

                    <Route exact path="/" >
                        <CssBaseline />
                        {!doorList && showings}
                        {doorList && [
                            <DoorList />,
                            <Button variant="contained" color="primary" onClick={() => setDoorList(false)}>Back</Button>
                        ]}
                    </Route>
                    <Redirect to="/" />
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
        </Container>
    );
}

export default App;

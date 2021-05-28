import { useState } from "react";
import "./App.css";
import ShowingsPage from "./components/ShowingsPage";
import CompleteOrder from "./components/CompleteOrder";
import DoorList from "./components/DoorList";
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { Container } from "@material-ui/core";

function App() {

    const [doorList, setDoorList] = useState(false);

    const showings = <ShowingsPage showingSelected={() => setDoorList(!doorList)} />;

    return (
        <Container maxWidth="md">
            <div id="maincontainer">
                <Navbar />
                <Switch>
                    <Route path="/events/:id">
                        <EventPage />
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
                        <CompleteOrder />
                    </Route>

                    <Route
                        exact
                        path="/"
                    >
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
        </Container>
    );
}

export default App;
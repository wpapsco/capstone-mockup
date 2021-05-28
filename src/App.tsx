import { useState } from "react";
import "./App.css";
import ShowingsPage from "./components/ShowingsPage";
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
import { Container } from "@material-ui/core";

function App() {

    const [doorList, setDoorList] = useState(false);

    const showings = <ShowingsPage showingSelected={() => setDoorList(!doorList)} />;

    return (
        <Container maxWidth="md">
            <Navbar />
            <div id="maincontainer">
                <Switch>
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
                    <Route path="/event">
                        <EventPage eventId="4" />
                    </Route>
                    <Route path="/order">
                        <EditOrderPage />
                    </Route>
                    <Route path="/cart">
                        <Cart />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </div>
        </Container>
    );
}

export default App;
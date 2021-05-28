import { useState } from "react";
import "./App.css";
import ShowingsPage from "./components/ShowingsPage";
import CompleteOrder from "./components/CompleteOrder";
import DoorList from "./components/DoorList";
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Navbar from './app/Navbar';
import {
     BrowserRouter as Router,
     Switch,
     Route,
     Redirect,
} from 'react-router-dom';
import EditOrderPage from "./features/ticketPurchase/EditOrderPage";
import Cart from './features/cart/Cart';
import EventPage from './features/events/EventPage'
import { Container } from "@material-ui/core";

function App() {

    const [doorList, setDoorList] = useState(false);

    const showings = <ShowingsPage showingSelected={() => setDoorList(!doorList)} />;

    return (
        <Router>
            <Navbar />
                <Switch>
                    <Route
                        exact
                        path="/">
                    <div id="maincontainer">
                        <CssBaseline />
                        {!doorList && showings}
                        {doorList && [
                            <DoorList />,
                            <Button variant="contained" color="primary" onClick={() => setDoorList(false)}>Back</Button>
                        ]}
                    </div>
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
                    <Redirect to="/" />
                </Switch>
        </Router>
    );
}

export default App;


const testEvent = {
    title: 'The Nutcracker',
    showdate: new Date('2021-03-07'),
    address: '123 Fake St, Portland, OR',
    headerImageUrl: 'https://www.tripsavvy.com/thmb/WaV9kZkbvvia0SQ1pd4PN7qgb3k=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/Lakewood-Theatre-Company-Godspell-5942d71e5f9b58d58a85bda5.jpg',
    bodySections: [
        { heading: 'Show Description', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
        { heading: 'Concessions Tickets', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis! Sit suscipit illo quos, quasi officia nostrum.' },
        { heading: 'Contacting Us', contents: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam unde iure modi nisi, culpa alias aliquid dicta, quas voluptate placeat dolor. Unde, quis!' },
    ]
}
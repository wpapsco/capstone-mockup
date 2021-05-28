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

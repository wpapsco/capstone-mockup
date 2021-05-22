import {Component} from "react";
import "./App.css";
import ShowingsPage from "./components/ShowingsPage";
import DoorList from "./components/DoorList";
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';

class App extends Component {

    public state = {
        doorList: false
    }

    public render() {
        return (
            <div id="maincontainer">
                <CssBaseline />
                {!this.state.doorList && <ShowingsPage showingSelected={() => this.setState({doorList: true})} />}
                {this.state.doorList && [
                    <DoorList />,
                    <Button variant="contained" color="primary" onClick={() => this.setState({doorList: false})}>Back</Button>
                ]}
            </div>
        );
    }
}

export default App;

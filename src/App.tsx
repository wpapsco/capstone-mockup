import {Component} from "react";
import "./App.css";
import UserInfo from "./components/UserInfo"
import Counter from "./components/Counter"

class App extends Component {

    // initializes the state of this component
    public state = {
        post: "",
        response: "",
        responseToPost: ""
    };

    // pretty much like a constructor
    public componentDidMount() {
        this.callApi() // get information from the server
            .then(res => this.setState({response: res.express})) // then use that information to change state
            .catch(err => console.log(err)); // and if there's an error, log it to the console
    }

    // get information from the server
    public async callApi() {
        const response = await fetch("/api/users/1234"); // fetch data from server
        const body     = await response.json(); // parse the json data
        if (response.status !== 200) { // check for errors
            throw Error(body.message);
        }
        return body; // return the parsed json
    }

    // send information to the server (in response to clicking the "submit" button)
    public handleSubmit = async (e: React.FormEvent<any>) => {
        e.preventDefault(); // don't do the normal HTML form submission stuff; basically this allows us to overwrite what happens when we submit

        const response = await fetch("/api/messages", { // communicate with the server at endpoint /api/mesages
            body: JSON.stringify({post: this.state.post}), // put data from this.state.post into the body of the message
            headers: {
                "Content-Type": "application/json" // tell it we're using json
            },
            method: "POST" // and this is a post, meaning we're giving data to the server; not only requesting it.
        });
        const body = await response.text(); // wait for the result of our post (the server's response)
        this.setState({responseToPost: body}); // and use that data to change state
    };

    public render() {
        return (
            <div className="App">
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <input
                        type="text"
                        value={this.state.post}
                        onChange={e => this.setState({post: e.target.value})}
                    />
                    <button type="submit">Submit</button>
                </form>
                <p>{this.state.responseToPost}</p>
                <UserInfo user="wpapsco"/>
                <Counter/>
            </div>
        );
    }
}

export default App;

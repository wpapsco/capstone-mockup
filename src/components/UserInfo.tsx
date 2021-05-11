import {Component} from "react";

type UserInfoProps = {
    user: string
}

class UserInfo extends Component<UserInfoProps> {
    // initializes the state of this component
    public state = {
        userinfo: ""
    };

    public componentDidMount() {
        this.callApi()
            .then(res => this.setState({userinfo: res.express}))
            .catch(err => console.log(err));
    }

    // get information from the server
    public async callApi() {
        const response = await fetch("/api/users/" + this.props.user); // fetch data from server
        const body     = await response.json(); // parse the json data
        if (response.status !== 200) { // check for errors
            throw Error(body.message);
        }
        return body; // return the parsed json
    }

    public render() { 
        return (
            <div>
                <p>{this.state.userinfo}</p>
            </div>
        );
    }
    
}

export default UserInfo;

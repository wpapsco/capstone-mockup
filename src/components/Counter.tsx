import {Component} from "react";

class Counter extends Component {
    public state = {
        count: 0
    }
    
    public increment() {
        this.setState({count: this.state.count + 1});
    }
    
    public render() {
        return (
            <button onClick={this.increment.bind(this)}>{this.state.count}</button>
        )
    }
}

export default Counter;
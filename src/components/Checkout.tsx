import {Component} from "react";
import InfoForm from "./InfoForm"
import DonoForm from "./DonoForm"

class Checkout extends Component {
    public state = {
        formState: "info"
    }

    private infoRes = "";
    private donoRes = "";

    private handleInfo = (a: string) => {
        this.infoRes = a;
        this.setState({formState: "dono"});
    }

    private handleDono = (a: string) => {
        this.donoRes = a;
        console.log(this.infoRes, this.donoRes);
    }

    public render() { 
        return (
            <div>
                {this.state.formState === "info" && <InfoForm onSubmit={this.handleInfo}/>}
                {this.state.formState === "dono" && <DonoForm onSubmit={this.handleDono}/>}
            </div>
        );
    }
}

export default Checkout;

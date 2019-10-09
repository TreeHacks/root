import queryString from "query-string";
import React from "react";
import { Redirect, Link } from "react-router-dom";
import Auth from "@aws-amplify/auth";
export default class Verify extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            verified: false
        }
    }
    componentDidMount() {
        this.verify();
    }
    verify() {
        // http://localhost:9000/verify?username=910e6571-c11e-4c83-9e27-cf220bdd6e41&code=315131
        const { username, code } = queryString.parse(window.location.search);
        Auth.confirmSignUp(username, code, {
            // Optional. Force user confirmation irrespective of existing alias. By default set to True.
            forceAliasCreation: true
        }).then(data => {
            console.log(data);
            this.setState({ verified: true });
        })
            .catch(err => {
                this.setState({ verified: false, error: err.code + " - " + err.message });
            });

    }
    render() {
        if (this.state.verified) {
            return <Redirect to="/" />;
        }
        return <div>
            <div className="bg-white">
            Verifying your email address...<br />
            {this.state.error && 
            <div>
                {this.state.error}
                <Link to="/"><button className="btn btn-primary">Back to Login</button></Link>
            </div>}
            </div>
        </div>;
    }
}
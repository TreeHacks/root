import React from "react";

declare const LOGIN_URL: string;

export default class Verify extends React.Component<{}, {}> {
    componentDidMount() {
        // http://localhost:9000/verify?username=910e6571-c11e-4c83-9e27-cf220bdd6e41&code=315131
        // Redirect to login site. This component is kept for backwards compatibility purposes
        // (can probably remove after a few weeks once verification URLs have expired)
        window.location.search = `${LOGIN_URL}/verify${window.location.search}`;
    }
    render() {
        return <a href={`${LOGIN_URL}/verify${window.location.search}`}>Click here to verify</a>;
    }
}
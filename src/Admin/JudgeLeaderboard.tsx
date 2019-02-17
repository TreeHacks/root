import React from "react";
import { API } from "aws-amplify";

export default class JudgeLeaderboard extends React.Component<{}, { refreshing: boolean, leaderboard_data: any, stats_data: any }> {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            leaderboard_data: null,
            stats_data: null
        }
    }
    componentDidMount() {
        this.loadData();
    }
    async loadData() {
        this.setState({ refreshing: true });

        Promise.all([
            API.get("treehacks", '/judging/leaderboard', {}),
            API.get("treehacks", '/judging/stats', {})
        ]).then(([leaderboard_data, stats_data]) => {
            window.scrollTo(0, 0);
            this.setState({ leaderboard_data, stats_data, refreshing: false });
        }).catch((err) => {
            alert("Error, " + err);
            this.setState({ refreshing: false });
            console.log(err);
        });
    }
    render() {
        return (<div className="container">
            <div style={{marginTop: 10}}><a href="#" onClick={e => { this.loadData(); e.preventDefault(); }}>{this.state.refreshing ? "Refreshing..." : "Refresh"}</a></div>
            <table className="table">
                <tbody>
                    {this.state.leaderboard_data && this.state.leaderboard_data.map(person => <tr key={person._id}>
                        <td>{(person._id || "None").replace(/@stanford.edu/, "")}</td>
                        <td>{person.count}</td>
                    </tr>
                    )}
                </tbody>
            </table>
            {this.state.stats_data &&
                <div className="">
                    {Object.keys(this.state.stats_data.results).map(key => 
                        <div>
                            {key}: <strong>{this.state.stats_data.results[key]}</strong>
                        </div>)}
                </div>}
        </div>);
    }
}
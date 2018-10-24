import React from "react";
import {connect} from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import "./Dashboard.scss";

export const Dashboard = (props: IDashboardProps) => {
    const date = new Date(`12/${props.profile.type === 'oos' ? 1 : 15}/2018`);
    const dateNow = new Date(Date.now()); 
    var diffDays = Math.round(Math.abs((date.getTime() - dateNow.getTime())/(24*60*60*1000)));

    console.log(diffDays);
    return (
        <div className="dashboard" style={{"backgroundImage": `url('${require('../art/combined_circuit.svg')}')`, "backgroundSize": "100% 100%"}}>
            <div style={{position: 'absolute', top: "56%", left: "50%", transform: "translateX(-50%)"}}>
            <div className="dashboard-design">
                {
                    props.profile.status === "submitted" ? (
                        <span>
                        You've application has been received and you are all good for now!<br/><br/>Check back on January 15th to view your application decision and then confirm attendance.</span>
                    ) : (
                        <div>
                            <span>
                            You haven't submitted your application yet. You have <br/> </span>
                            <span style={{color: "#00E073", fontSize: '70px'}}>
                                {diffDays}
                            </span>
                            <span><br/>
                                days to submit your application before the January 1st deadline at midnight PST.
                            </span>
                        </div>
                    )
                }
            </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getUserProfile: () => dispatch(getUserProfile())
});

class DashboardWrapper extends React.Component<IDashboardWrapperProps, {}> {
    componentDidMount() {
        this.props.getUserProfile();
    }
    render() {
        if (!this.props.profile) {
            return <Loading />;
        }
        return <Dashboard profile={this.props.profile} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper);
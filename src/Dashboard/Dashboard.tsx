import React from "react";
import {connect} from "react-redux";
import { getUserProfile } from "../store/form/actions";
import { IFormState } from "../store/form/types";
import { IDashboardProps, IDashboardWrapperProps } from "./types";
import Loading from "../Loading/Loading";
import "./Dashboard.scss";

export const Dashboard = (props: IDashboardProps) => {
    let date = null;
    switch (props.profile.type) {
        case "is":
            date = new Date("12/15/2018");
            break;
        case "stanford":
            date = new Date("2/15/2019");
            break;
        case "oos":
        default:
            date = new Date("12/1/2018");
    }
    const dateNow = new Date();
    const diffDays = Math.round(Math.abs((date.getTime() - dateNow.getTime())/(24*60*60*1000)));

    return (
        <div className="dashboard" style={{"backgroundImage": `url('${require('../art/combined_circuit.svg')}')`, "backgroundSize": "100% 100%"}}>
            <div style={{position: 'absolute', top: "50%", left: "50%", transform: "translateX(-50%) translateY(-50%)"}}>
            <div className="dashboard-design">
                {
                    props.profile.status === "submitted" ? (
                        <span>
                        Your application has been received, and you are all good for now!<br/><br/>We will email you when decisions are released and will handle any travel questions at that time. Thanks for applying :)</span>
                    ) : (
                        <div>
                            <span>
                            You haven't submitted your application yet. You have <br/> </span>
                            <span style={{color: "#00E073", fontSize: '70px'}}>
                                {diffDays}
                            </span>
                            <span><br/>
                                days to submit your application before the deadline.
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

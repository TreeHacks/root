import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationStats } from "../store/admin/actions";
import { Pie, PieChart } from "recharts";
import { IAdminState } from "../store/admin/types";

const Stats = (props: IStatsProps) => {
    return <div>
        <div className="row">
            {Object.keys(props.applicationStats).map(key => (
                <div key={key} className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2"><h3 className="text-white text-center">{key}</h3>
                    <PieChart width={250} height={250}>
                        <Pie data={props.applicationStats[key]} label={true} dataKey="count" nameKey="_id" />
                    </PieChart>
                </div>
            ))}
        </div>
    </div>
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getApplicationStats: () => dispatch(getApplicationStats())
});

class StatsWrapper extends React.Component<IStatsWrapperProps, {}> {
    componentDidMount() {
        this.props.getApplicationStats();
    }
    render() {
        if (!this.props.applicationStats) {
            return <Loading />;
        }
        return <Stats applicationStats={this.props.applicationStats} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsWrapper);
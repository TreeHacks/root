import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationStats } from "../store/admin/actions";
import { Pie, PieChart, Tooltip } from "recharts";
import { IAdminState } from "../store/admin/types";
import {filter} from "lodash";

const Stats = (props: IStatsProps) => {
    return <div>
        <div className="row">
            {Object.keys(props.applicationStats).map(key => (
                <div key={key} className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3"><h3 className="text-center">{key}</h3>
                    <PieChart width={250} height={250}>
                        <Pie data={filter(props.applicationStats[key], e => e._id !== null)} label={true} dataKey="count" nameKey="_id"
                            
                        />
                        <Tooltip />
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
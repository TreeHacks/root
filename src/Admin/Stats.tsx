import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationStats } from "../store/admin/actions";
import { Pie, PieChart, Tooltip, LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer, Legend } from "recharts";
import { IAdminState } from "../store/admin/types";
import { filter } from "lodash";

const Stats = (props: IStatsProps) => {
    return <div>
        <div className="row">
            {Object.keys(props.applicationStats).map(key => (
                <div key={key} className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-3"><h3 className="text-center">{key}</h3>
                    {key === "timeline" ?
                        <LineChart width={800} height={500}
                            // data={props.applicationStats[key]}>
                            data={[{num_is: 0, num_oos: 0, num_stanford: 10, date: "2019-10-25T15:46:22.000Z"}, {num_is: 50, num_oos: 0, num_stanford: 10, date: "2019-10-26T15:46:22.000Z"}, {num_is: 52, num_oos: 0, num_stanford: 10, date: "2019-10-27T15:46:22.000Z"}]}>
                            <XAxis dataKey="date_created" />
                            <YAxis />
                            <Legend />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="num_is" stroke="red" />
                            <Line type="monotone" dataKey="num_oos" stroke="green" />
                            <Line type="monotone" dataKey="num_stanford" stroke="blue" />
                        </LineChart>
                        : <PieChart width={250} height={250}>
                            <Pie data={filter(props.applicationStats[key], e => e._id !== null)} label={true} dataKey="count" nameKey="_id"

                            />
                            <Tooltip />
                        </PieChart>
                    }
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
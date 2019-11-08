import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationStats } from "../store/admin/actions";
import { Pie, PieChart, Tooltip, LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer, Legend } from "recharts";
import { IAdminState } from "../store/admin/types";
import { filter } from "lodash";

// Test data
// let DATA = [{ "num_is": 0, "num_oos": 2, "num_stanford": 2, "num_incomplete": 3, "num_submitted": 1, "date": "2019-10-25T00:00:00.000Z", "num_total": 4 }, { "num_is": 0, "num_oos": 2, "num_stanford": 3, "num_incomplete": 4, "num_submitted": 1, "date": "2019-10-26T00:00:00.000Z", "num_total": 5 }, { "num_is": 1, "num_oos": 3, "num_stanford": 4, "num_incomplete": 5, "num_submitted": 3, "date": "2019-11-05T00:00:00.000Z", "num_total": 8 }, { "num_is": 2, "num_oos": 6, "num_stanford": 4, "num_incomplete": 8, "num_submitted": 4, "date": "2019-11-06T00:00:00.000Z", "num_total": 12 }, { "num_is": 2, "num_oos": 7, "num_stanford": 4, "num_incomplete": 9, "num_submitted": 4, "date": "2019-11-07T00:00:00.000Z", "num_total": 13 }];

const DateChart = ({ data, children }) => <LineChart width={800} height={500}
    data={data}>
    <XAxis dataKey={e => new Date(e.date).getTime()}
        scale="linear"
        tickFormatter={timestamp => new Date(timestamp).toLocaleDateString()} />
    <YAxis />
    <Legend />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    {children}
    <Tooltip labelFormatter={e => new Date(e).toLocaleDateString()} />
</LineChart>;

const Stats = (props: IStatsProps) => {
    return <div>
        <div className="row">
            {Object.keys(props.applicationStats).map(key => (
                key === "timeline" ?
                    <div key={key} className="col-12"><h3 className="text-center">{key}</h3>
                        <DateChart data={props.applicationStats[key]}>
                            <Line type="monotone" dataKey="num_is" stroke="red" />
                            <Line type="monotone" dataKey="num_oos" stroke="green" />
                            <Line type="monotone" dataKey="num_stanford" stroke="blue" />
                            <Line type="monotone" dataKey="num_total" stroke="black" />
                        </DateChart>
                        <DateChart data={props.applicationStats[key]}>
                            <Line type="monotone" dataKey="num_submitted" stroke="red" />
                            <Line type="monotone" dataKey="num_incomplete" stroke="green" />
                            <Line type="monotone" dataKey="num_total" stroke="black" />
                        </DateChart>
                    </div>
                    :
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
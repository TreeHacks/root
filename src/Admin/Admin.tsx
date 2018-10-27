import React from "react";
import { connect } from "react-redux";
import { IAdminWrapperProps, IAdminProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationList, setApplicationStatus } from "../store/review/actions";
import ReactTable from "react-table";
import { get, values } from "lodash-es";
import 'react-table/react-table.css';
import { STATUS, TYPE } from "../constants";

const defaultFilterMethod = (filter, row) => {
    if (filter.value == "all") {
        return true;
    }
    return row[filter.id] == filter.value;
};

const createFilterSelect = (values) => ({ filter, onChange }) =>
    <select
        className="form-control"
        value={filter ? filter.value : "all"}
        onChange={event => onChange(event.target.value)}
    >
        {values.map(e =>
            <option key={e}>{e}</option>
        )}
        <option>all</option>
    </select>;

const columns = [
    {
        "Header": "ID",
        "accessor": "_id"
    },
    {
        "Header": "email",
        "accessor": "user.email"
    },
    {
        "Header": "type",
        "filterMethod": defaultFilterMethod,
        "Filter": createFilterSelect(values(TYPE)),
        "accessor": "type"
    },
    {
        "Header": "Status",
        "accessor": "status",
        "filterMethod": defaultFilterMethod,
        "Filter": createFilterSelect(values(STATUS)),
        "Cell": (props) => <div>{props.value}</div>
    }
]

const Admin = (props: IAdminProps) => (
    <div>
        <h3>Applications:</h3>
        <div className="bg-white col-8 offset-2 p-4">
            <ReactTable filterable columns={columns} data={props.applicationList} minRows={0}>
                {(state, makeTable, instance) => {
                    return (
                        <div>
                            User emails shown:
                            <input type="text"
                                readOnly
                                value={state.sortedData.map(e => e && get(e, "user.email")).join(",")}
                                style={{width: "100%"}}
                                />
                            {makeTable()}
                        </div>
                    );
                }}
            </ReactTable>
        </div>
    </div>
);

const mapStateToProps = state => ({
    ...state.review
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getApplicationList: () => dispatch(getApplicationList()),
    setApplicationStatus: (a, b) => dispatch(setApplicationStatus(a, b))
});

class AdminWrapper extends React.Component<IAdminWrapperProps, {}> {
    componentDidMount() {
        this.props.getApplicationList();
    }
    render() {
        if (!this.props.applicationList) {
            return <Loading />;
        }
        return <Admin applicationList={this.props.applicationList} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminWrapper);
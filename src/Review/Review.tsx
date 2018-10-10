import React from "react";
import { connect } from "react-redux";
import { IReviewWrapperProps, IReviewProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationList, setApplicationStatus } from "../store/review/actions";
import ReactTable from "react-table";
import {get} from "lodash-es";
import 'react-table/react-table.css';

const columns = [
    {
        "Header": "ID",
        "accessor": "_id"
    },
    {
        "Header": "status",
        "accessor": "status"
    },
    {
        "Header": "email",
        "accessor": "user.email"
    },
    {
        "Header": "type",
        "accessor": "type"
    },
    {
        "Header": "Status",
        "Cell": (props) => <select><option>1</option><option>2</option><option>3</option></select>
    }
]

const Review = (props: IReviewProps) => (
    <div>
        <h3>Applications:</h3>
        <div className="bg-white col-8 offset-2">
            <ReactTable filterable columns={columns} data={props.applicationList}>
                {(state, makeTable, instance) => {
                    return (
                        <div>
                            User emails shown: <input type="text" value={state.sortedData.map(e => e && get(e, "user.email")).join(",")} />
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

class ReviewWrapper extends React.Component<IReviewWrapperProps, {}> {
    componentDidMount() {
        console.log("mounting");
        this.props.getApplicationList();
    }
    render() {
        if (!this.props.applicationList) {
            return <Loading />;
        }
        return <Review applicationList={this.props.applicationList} />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewWrapper);
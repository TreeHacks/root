import React from "react";
import { connect } from "react-redux";
import { ISponsorsTableProps } from "./types";
import Loading from "../Loading/Loading";
import { getApplicationList, setApplicationStatus, setSelectedForm, getApplicationEmails, getExportedApplications, getApplicationResumes, getExportedApplicationsCSV } from "../store/admin/actions";
import ReactTable from "react-table";
import { pickBy, values } from "lodash-es";
import 'react-table/react-table.css';
import { STATUS, TYPE, sponsorApplicationDisplayFields } from "../constants";
import { IAdminState } from "../store/admin/types";
import ApplicationView from "../Admin/ApplicationView";
import { IBaseState } from "src/store/base/types";

const SponsorsTable = (props: ISponsorsTableProps) => {
    const columns = [
        {
            "Header": "Preview",
            "accessor": "_id",
            "id": "view",
            "filterable": false,
            "Cell": (p) => <div onClick={(e) => {
                e.preventDefault(); props.setSelectedForm && props.setSelectedForm({ "id": p.value, "name": "application_info" })
            }}><a href="#">View</a></div>
        },
        {
            "Header": "email",
            "accessor": "user.email"
        },
        {
            "Header": "University",
            "accessor": "forms.application_info.university"
        },
        {
            "Header": "Graduation Year",
            "accessor": "forms.application_info.graduation_year"
        },
        {
            "Header": "Level of Study",
            "accessor": "forms.application_info.level_of_study"
        },
        {
            "Header": "Major",
            "accessor": "forms.application_info.major"
        },
        {
            "Header": "Q2 - Tell us a story about creating the project you're most proud of (technical or nontechnical). Why did you choose to work on it? What did you learn from it?",
            "accessor": "forms.application_info.q2_experience",
            "show": false
        },
        {
            "Header": "Q4 (Optional) - Add any links (separated by commas) that you'd like us to check out! GitHub, LinkedIn, Devpost, Dribbble, etc.",
            "accessor": "forms.application_info.q4",
            "show": false
        },
    ];
    const columnsToExport = columns.filter(e => e.accessor !== "_id");
    return (
        <div>
            <div className="col-12">
                <h3>Applications</h3>
                <ReactTable filterable columns={columns} data={props.applicationList} minRows={0}
                    pages={props.pages}
                    manual
                    // loading={props.base.loading}
                    // defaultPageSize={1}
                    onFetchData={(state, instance) => props.getApplicationList && props.getApplicationList(state)}
                >
                    {(state, makeTable, instance) => {
                        return (
                            <div>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getExportedApplicationsCSV(state, columnsToExport)}>Export</button> (Export all pages of filtered results as CSV)</p>
                                <p><button className="btn btn-sm btn-outline-primary" onClick={() => props.getApplicationResumes(state)}>Get resumes</button> (Get resumes of all pages of filtered results)</p>
                                {makeTable()}
                            </div>
                        );
                    }}
                </ReactTable>
            </div>
            {props.selectedForm && <ApplicationView shownFields={sponsorApplicationDisplayFields} />}
        </div>
    );
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState),
    base: state.base as IBaseState
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getApplicationList: (e) => dispatch(getApplicationList(e)),
    setApplicationStatus: (a, b) => dispatch(setApplicationStatus(a, b)),
    setSelectedForm: e => dispatch(setSelectedForm(e)),
    getApplicationResumes: e => dispatch(getApplicationResumes(e)),
    getExportedApplicationsCSV: (e, c) => dispatch(getExportedApplicationsCSV(e, c))
});

export default connect(mapStateToProps, mapDispatchToProps)(SponsorsTable);
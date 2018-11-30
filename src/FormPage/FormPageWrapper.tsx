import React from "react";
import Form from "react-jsonschema-form";
import Beforeunload from "react-beforeunload";
import { Prompt } from "react-router";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData, getUserProfile, submitForm, setFormName } from "../store/form/actions";

import { DEADLINES } from '../constants';
import { IFormPageWrapperProps } from "./types";
import { cloneDeep, get, set, pull } from "lodash-es";
import Loading from "../Loading/Loading";
import { push } from 'connected-react-router';
import CustomDateWidget from './CustomDateWidget';
import { TypeaheadField } from "react-jsonschema-form-extras/lib/TypeaheadField";
import FormPage from "./FormPage";

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPage: (e) => dispatch(setPage(e)),
    setData: (e, userEdited) => dispatch(setData(e, userEdited)),
    saveData: () => dispatch(saveData()),
    submitForm: () => dispatch(submitForm()),
    loadData: () => { dispatch(loadData()) },
    goHome: () => { dispatch(push("/")) },
    getUserProfile: () => dispatch(getUserProfile()),
    setFormName: (e: string) => dispatch(setFormName(e))
});

class FormPageWrapper extends React.Component<IFormPageWrapperProps, { showSavedAlert: boolean }> {
    constructor(props) {
        super(props);
        this.state = { showSavedAlert: false };
    }
    componentDidMount() {
        this.props.setFormName(this.props.incomingFormName);
        this.props.loadData();
        // this.props.setData({"first_name":"sad","last_name":"dsf","phone":"123123123","dob":"1901-01-02","gender":"F","race":["American Indian / Alaska Native"],"university":"2nd Military Medical University","graduation_year":"2018","level_of_study":"Graduate","major":"sa","accept_terms":true,"accept_share":true});
        this.props.getUserProfile();
    }
    onSubmit(submit) {
        const props = this.props;
        (get(props, "profile.status") === "submitted" ? () => Promise.resolve(null) : props.saveData)().then(() => {
            if (submit) {
                return props.submitForm().then(() => props.goHome());
            } else {
                this.setState({ showSavedAlert: true });
                window.scrollTo(0, 0);
            }
        });
    }
    render() {
        if (!this.props.formData || this.props.formName !== this.props.incomingFormName) {
            return <Loading />;
        }
        const props = this.props;
        let schema = props.schemas[props.formName].schema;
        const uiSchema = props.schemas[props.formName].uiSchema;

        // Inject direct link to MLH COC into accept_terms
        if (get(schema, 'properties.accept_terms')) {
            schema.properties.accept_terms.title = <span>I have read and agree to the <a className="form-link" href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf" target="_blank" onClick={e => e.stopPropagation()}>MLH Code of Conduct</a>.</span>;
        }
        if (get(schema, 'properties.accept_share')) {
            schema.properties.accept_share.title = <span>I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the <a className="form-link" href="https://mlh.io/privacy" target="_blank" onClick={e => e.stopPropagation()}>MLH Privacy Policy</a>. I further I agree to the terms of both the <a className="form-link" href="https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md" target="_blank" onClick={e => e.stopPropagation()}>MLH Contest Terms and Conditions</a> and the MLH Privacy Policy.</span>;
        }

        const deadline = DEADLINES.find(d => d.key === get(props, "profile.type"));
        const hasDeadlinePassed = deadline && (new Date()) > new Date(deadline.date);

        const submitted = get(props, "profile.status") === "submitted";

        const alertMessage = submitted ? `Thanks for applying! Check your dashboard for updates on your application, and email us if any of the information submitted changes.` :
            hasDeadlinePassed ? 'Sorry, the application window has closed.' :
            this.state.showSavedAlert ? `Your application progress has been saved. Make sure you finalize and submit before the deadline.` : null;

        const unsavedChangesWarning = 'You have unsaved changes to your application. Are you sure you want to leave? You can save your application to continue later by clicking "Save for later" at the bottom of the page.',
            showUnsavedWarning = props.userEdited && !submitted;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Beforeunload onBeforeunload={e => showUnsavedWarning ? unsavedChangesWarning : true} />
                <Prompt when={showUnsavedWarning} message={unsavedChangesWarning} />
                {alertMessage && <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '550px', marginTop: '60px', marginBottom: '-40px', padding: '20px', color: 'white', textAlign: 'center' }}>
                    {alertMessage}
                </div>}
                {!hasDeadlinePassed ?
                    <FormPage
                        submitted={submitted}
                        onChange={e => {
                            const userEdited = JSON.stringify(e.formData) !== JSON.stringify(props.formData);
                            props.setData(e.formData, userEdited);
                        }}
                        onError={() => window.scrollTo(0, 0)}
                        onSubmit={(e) => this.onSubmit(e)}
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={props.formData} />
                : null}
            </div>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPageWrapper);
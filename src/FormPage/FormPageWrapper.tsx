import React from "react";
import Modal from "react-responsive-modal";
import Beforeunload from "react-beforeunload";
import { Prompt } from "react-router";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData, getUserProfile, submitForm, setFormName } from "../store/form/actions";

import { DEADLINES, TYPE, applicationDisplayFields, applicationDisplayFieldsStanford } from '../constants';
import { IFormPageWrapperProps } from "./types";
import { cloneDeep, get } from "lodash";
import Loading from "../Loading/Loading";
import { push } from 'connected-react-router';
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

class FormPageWrapper extends React.Component<IFormPageWrapperProps, { showSavedAlert: boolean, showModal: boolean }> {
    constructor(props) {
        super(props);
        this.state = { 
            showSavedAlert: false,
            showModal: false
        };
    }
    componentDidMount() {
        this.props.setFormName(this.props.incomingFormName);
        this.props.loadData();
        //this.props.setData({"first_name":"sad","last_name":"dsf","phone":"123123123","dob":"1901-01-02","gender":"F","race":["American Indian / Alaska Native"],"university":"2nd Military Medical University","graduation_year":"2018","level_of_study":"Graduate","major":"sa","accept_terms":true,"accept_share":true}, true);
        this.props.getUserProfile();
    }
    onSubmit(submit) {
        const props = this.props;
        (get(props, "profile.status") !== "incomplete" ? () => Promise.resolve(null) : props.saveData)().then(() => {
            if (submit) {
                this.setState({showModal: true});
            } else {
                this.setState({ showSavedAlert: true });
                window.scrollTo(0, 0);
            }
        });
    }
    submitData() {
        const props = this.props;
        return props.submitForm().then(() => props.goHome());
    }
    onCloseModal() {
        this.setState({showModal: false});
    }
    render() {
        if (!this.props.formData || this.props.formName !== this.props.incomingFormName) {
            return <Loading />;
        }
        const props = this.props;
        let schema = cloneDeep(props.schemas[props.formName].schema);
        const uiSchema = cloneDeep(props.schemas[props.formName].uiSchema);

        // Inject mailing link and style into section1 description
        if (get(schema, 'properties.section1')) {
            schema.properties.section1.custom_description = <span>We’re so excited that you want to come to TreeHacks 2022! <b>If you have any questions, feel free to reach out at <a className="email-link" href="mailto:hello@treehacks.com">hello@treehacks.com</a>.</b> Let’s start with the basics.</span>
        }

        // Inject direct link to COC into accept_terms
        if (get(schema, 'properties.accept_terms')) {
            schema.properties.accept_terms.title = <span>I have read and agree to the <a className="form-link" href="https://www.treehacks.com/code-of-conduct" target="_blank">TreeHacks Code of Conduct.</a></span>;
        }
        if (get(schema, 'properties.accept_share')) {
            schema.properties.accept_share.title = <span>I have read and agree to the <a className="form-link" href="https://www.treehacks.com/privacy-policy" target="_blank" onClick={e => e.stopPropagation()}>TreeHacks Privacy Policy</a>.</span>;
        }

        let shownFields = get(props, "profile.type") === TYPE.STANFORD ? applicationDisplayFieldsStanford : applicationDisplayFields;


        const deadline = DEADLINES.find(d => d.key === get(props, "profile.type"));
        const hasDeadlinePassed = deadline && (new Date()) > new Date(deadline.date);

        const submitted = get(props, "profile.status") !== "incomplete";

        const alertMessage = submitted ? `Thanks for applying! Check your dashboard for updates on your application, and email us if any of the information submitted changes.` :
            hasDeadlinePassed ? 'Sorry, the application window has closed.' :
            this.state.showSavedAlert ? `Your application progress has been saved. Make sure you finalize and submit before the deadline.` : null;

        const unsavedChangesWarning = 'You have unsaved changes to your application. Are you sure you want to leave? You can save your application to continue later by clicking "Save for later" at the bottom of the page.',
            showUnsavedWarning = props.userEdited && !submitted;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Beforeunload onBeforeunload={e => showUnsavedWarning ? unsavedChangesWarning : true} />
                <Prompt when={showUnsavedWarning} message={unsavedChangesWarning} />
                {alertMessage && <div className="treehacks-alert" style={{ maxWidth: '550px', marginTop: '60px', marginBottom: '-40px' }}>
                    {alertMessage}
                </div>}
                {!hasDeadlinePassed ?
                    <FormPage
                        submitted={submitted}
                        onChange={e => {
                            const userEdited = JSON.stringify(e.formData) !== JSON.stringify(props.formData);
                            props.setData(e.formData, userEdited);
                        }}
                        onError={() => {
                            this.setState({showSavedAlert: false}, () => window.scrollTo(0, 0));
                        }}
                        onSubmit={(e) => this.onSubmit(e)}
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={props.formData}
                        shownFields={shownFields}
                        />
                : null}
                <Modal open={this.state.showModal} onClose={() => this.onCloseModal()}>
                    <div className="my-1 modal-window">
                        <div className="my-4">
                            Are you sure? You won't be able to edit your application once you submit.
                        </div>
                        <div className="row">
                            <div className="col-6 text-left">
                                <div className="mt-2 btn btn-modal inverted" onClick={() => this.onCloseModal()}>
                                    Cancel
                                </div>
                            </div>
                            <div className="col-6 text-right">
                                <div className="mt-2 btn btn-modal" onClick={() => this.submitData()}>
                                    Submit
                                </div>
                            </div>
                        </div>
                    </div>       
                </Modal>
            </div>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPageWrapper);
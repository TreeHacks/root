import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData, getUserProfile, submitForm, setFormName } from "../store/form/actions";

import { IFormPageProps } from "./types";
import { cloneDeep, get, set, pull } from "lodash-es";
import Loading from "../Loading/Loading";
import { push } from 'connected-react-router';
import "./FormPage.scss";
import CustomDateWidget from './CustomDateWidget';
import { TypeaheadField } from "react-jsonschema-form-extras/lib/TypeaheadField";

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPage: (e) => dispatch(setPage(e)),
    setData: (e) => dispatch(setData(e)),
    saveData: () => dispatch(saveData()),
    submitForm: () => dispatch(submitForm()),
    loadData: () => { dispatch(loadData()) },
    goHome: () => { dispatch(push("/")) },
    getUserProfile: () => dispatch(getUserProfile()),
    setFormName: (e: string) => dispatch(setFormName(e))
});


const SectionHeaderWidget = (props) => {
  const { schema } = props;
  return (
      <legend>
        {schema.title} 
      </legend>
  );
};

function base64MimeType(encoded) {
    var result = null;

    if (typeof encoded !== 'string') {
        return result;
    }

    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
        result = mime[1];
    }

    return result;
}
function validate(formData, errors) {
    if (formData.resume) {
        if (!~["application/pdf"].indexOf(base64MimeType(formData.resume))) {
            console.log(base64MimeType(formData.resume));
            errors.resume.addError("Resume must be a PDF");
        }
    }
    return errors;
}

class FormPage extends React.Component<IFormPageProps, { showSavedAlert: boolean }> {
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
        if (!this.props.formData) {
            return <Loading />;
        }
        const props = this.props;
        const schemaObj = props.schemas[props.formName];
        // console.log(props.formName, props.schemas);
        const uiOrder = [...schemaObj.pages[props.page], "*"];
        let schema = cloneDeep(schemaObj.schema);
        let uiSchema = cloneDeep(schemaObj.uiSchema);

        // Display proper page:
        uiSchema["ui:order"] = uiOrder;
        for (let item in schema.properties) {
            if (!~uiOrder.indexOf(item)) {
                const existingClass = get(uiSchema, `${item}.classNames`) || "";
                set(uiSchema, `${item}.classNames`, `${existingClass} treehacks-hidden`);
                if (schema.required) {
                    pull(schema.required, item);
                }
                // set(uiSchema, `${item}.ui:widget`, "hidden"); // Can't hide array fields, doesn't work this way.
            }
        }

        const submitted = get(props, "profile.status") === "submitted";

        const alertMessage = submitted ? `Thanks for applying! Check your dashboard for updates on your application, and email us if any of the information submitted changes.` :
            this.state.showSavedAlert ? `Your application progress has been saved. Make sure you finalize and submit before the deadline.` : null;

        return (
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
            {alertMessage && <div style={{backgroundColor: '#686e77', width: '100%', maxWidth: '550px', marginTop: '60px', marginBottom: '-40px', padding: '20px', color: 'white', textAlign: 'center'}}>
                {alertMessage}
            </div>}
            <Form
                className="treehacks-form" 
                schema={schema}
                uiSchema={{
                    ...uiSchema,
                    "ui:readonly": submitted,
                }} formData={props.formData}
                // liveValidate={true}
                showErrorList={true}
                validate={validate}
                fields={{ typeahead: TypeaheadField }}
                widgets={{sectionHeader: SectionHeaderWidget, customDate: CustomDateWidget }}
                onChange={e => { props.setData(e.formData) }}
                onError={() => window.scrollTo(0, 0)}
                onSubmit={(e) => this.onSubmit(e)}>
                {props.page == schemaObj.pages.length - 1 &&
                    (!submitted ?
                        <div className="btn-container">
                            <div>
                                <input
                                    className="btn btn-custom inverted"
                                    type="submit"
                                    value="Save for later"
                                    onClick={e => { e.preventDefault(); this.onSubmit(false); }}
                                />
                                <input
                                    className="btn btn-custom"
                                    type="submit"
                                    value="Submit"
                                    //onClick={e => this.onSubmit(true)}
                                />
                            </div>
                        </div>
                    : <div></div>)}
            </Form>
        </div>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData } from "../store/form/actions";
import { IFormPageProps } from "./types";
import { cloneDeep, get, set, pull } from "lodash-es";
import Loading from "../Loading/Loading";
import { push } from 'connected-react-router';
import "./FormPage.scss";

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPage: (e) => dispatch(setPage(e)),
    setData: (e) => dispatch(setData(e)),
    saveData: () => dispatch(saveData()),
    loadData: () => { dispatch(loadData()) },
    goHome: () => { dispatch(push("/")) }
});


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

class FormPage extends React.Component<IFormPageProps, { afterSubmit: number }> {
    constructor(props) {
        super(props);
        this.state = {afterSubmit: null};
    }
    componentDidMount() {
        this.props.loadData();
        // this.props.setData({"first_name":"sad","last_name":"dsf","phone":"123123123","dob":"1901-01-02","gender":"F","race":["American Indian / Alaska Native"],"university":"2nd Military Medical University","graduation_year":"2018","level_of_study":"Graduate","major":"sa","accept_terms":true,"accept_share":true});
    }
    onSubmit(e) {
        const props = this.props;
        props.saveData();
        if (this.state.afterSubmit == 1) {
            props.setPage(props.page + 1);
        }
        else if (this.state.afterSubmit == -1) {
            props.setPage(props.page - 1);
        }
        else {
            props.goHome();
        }
        this.setState({ "afterSubmit": 0 });
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

        return (<Form schema={schema} uiSchema={uiSchema} formData={props.formData}
            // liveValidate={true}
            showErrorList={true}
            validate={validate}
            onChange={e => { props.setData(e.formData) }}
            onSubmit={(e) => this.onSubmit(e)}>
            <input className="btn" type="submit"
                name="treehacks_previous"
                value="Previous page"
                disabled={props.page - 1 < 0}
                onClick={e => this.setState({ "afterSubmit": -1 })}
            />
            <input className="btn" type="submit"
                name="treehacks_next"
                value="Next page"
                disabled={props.page + 1 >= schemaObj.pages.length}
                onClick={e => this.setState({ "afterSubmit": 1 })}
            />
            {props.page == schemaObj.pages.length - 1 &&
                <input className="btn btn-primary" type="submit" />}
        </Form>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
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

const SectionHeaderWidget = (props) => {
    const { schema } = props;
    return (
        <legend>
            {schema.title}
        </legend>
    );
};

const FilePreviewWidget = (props) => {
    if (!props.value) {
        return <div>No file uploaded.</div>;
    }
    return <div>
        <iframe src={props.value} style={{ width: "100%", minHeight: 400 }}></iframe>
    </div>;
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
export default (props: IFormPageProps) => {
    let widgets;
    if (props.submitted) {
        widgets = { sectionHeader: SectionHeaderWidget, customDate: CustomDateWidget, FileWidget: FilePreviewWidget };
    }
    else {
        widgets = { sectionHeader: SectionHeaderWidget, customDate: CustomDateWidget };
    }
    return (<Form
        className={`treehacks-form ${props.submitted ? "treehacks-form-disabled" : ""}`}
        schema={props.schema}
        uiSchema={{
            ...props.uiSchema,
            "ui:readonly": props.submitted,
        }} formData={props.formData}
        // liveValidate={true}
        showErrorList={true}
        validate={validate}
        fields={{ typeahead: TypeaheadField }}
        widgets={widgets}
        onChange={e => props.onChange(e)}
        onError={(e) => props.onError(e)}
        onSubmit={e => props.onSubmit(e)}>
        {!props.submitted ?
            <div className="btn-container">
                <div>
                    <input
                        className="btn btn-custom inverted"
                        type="submit"
                        value="Save for later"
                        onClick={e => { e.preventDefault(); props.onSubmit(false); }}
                    />
                    <input
                        className="btn btn-custom"
                        type="submit"
                        value="Submit"
                    //onClick={e => this.onSubmit(true)}
                    />
                </div>
            </div>
            : <div></div>}
    </Form>);
}
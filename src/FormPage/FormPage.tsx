import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData } from "../store/form/actions";
import { IFormPageProps } from "./types";
import { cloneDeep, get, set } from "lodash-es";
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

function validate(formData, errors) {
    console.log(formData.resume, errors);
}
class FormPage extends React.Component<IFormPageProps, {}> {
    componentDidMount() {
        this.props.loadData();
    }
    render() {
        if (!this.props.formData) {
            return <Loading />;
        }

        const props = this.props;
        const schemaObj = props.schemas[props.formName];
        // console.log(props.formName, props.schemas);
        const uiOrder = [...schemaObj.pages[props.page], "*"];
        const schema = schemaObj.schema;
        let uiSchema = cloneDeep(schemaObj.uiSchema);

        // Display proper page:
        uiSchema["ui:order"] = uiOrder;
        for (let item in schema.properties) {
            if (!~uiOrder.indexOf(item)) {
                const existingClass = get(uiSchema, `${item}.classNames`) || "";
                set(uiSchema, `${item}.classNames`, `${existingClass} treehacks-hidden`);
                // set(uiSchema, `${item}.ui:widget`, "hidden"); // Can't hide array fields, doesn't work this way.
            }
        }

        return (<Form schema={schema} uiSchema={uiSchema} formData={props.formData}
            liveValidate={true}
            // showErrorList={true}
            // validate={validate}
            onChange={e => props.setData(e.formData) }
            onSubmit={e => { props.saveData(); this.props.goHome(); }}>
            <button className="btn" type="button"
                disabled={props.page - 1 < 0}
                onClick={() => { props.saveData(); props.setPage(props.page - 1) }} >Previous page</button>
            <button className="btn" type="button"
                disabled={props.page + 1 >= schemaObj.pages.length}
                onClick={() => { props.saveData(); props.setPage(props.page + 1) }} >Next page</button >
            {props.page == schemaObj.pages.length - 1 &&
                <input className="btn btn-primary" type="submit" />}
        </Form>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
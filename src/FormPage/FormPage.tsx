import React from "react";
import Form from "react-jsonschema-form";
import { connect } from 'react-redux';
import { setPage, setData, saveData, loadData } from "../store/form/actions";
import { IFormPageProps } from "./types";
import { cloneDeep, set } from "lodash-es";
import Loading from "../Loading/Loading";

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPage: (e) => dispatch(setPage(e)),
    setData: (e) => dispatch(setData(e)),
    saveData: () => dispatch(saveData()),
    loadData: () => dispatch(loadData()),
});

class FormPage extends React.Component<IFormPageProps, {}> {
    componentDidMount() {
        this.props.loadData();
    }
    render() {
        if (!this.props.formData) {
            return <Loading />;
        }

        const props = this.props;
        const uiOrder = [...props.schemas.application.pages[props.page], "*"];
        const schema = props.schemas.application.schema;
        let uiSchema = cloneDeep(props.schemas.application.uiSchema);
        
        // Display proper page:
        uiSchema["ui:order"] = uiOrder;
        for (let item in schema.properties) {
            if (!~uiOrder.indexOf(item)) {
                set(uiSchema, `${item}.ui:widget`, "hidden");
            }
        }

        return (<Form schema={schema} uiSchema={uiSchema} formData={props.formData}
            onSubmit={e => { props.saveData() }}>
            <button className="btn"
                disabled={props.page - 1 < 0}
                onClick={() => { props.saveData(); props.setPage(props.page - 1) }} >Previous page</button>
            <button className="btn"
                disabled={props.page + 1 >= props.schemas.application.pages.length}
                onClick={() => { props.saveData(); props.setPage(props.page + 1) }} >Next page</button >
            {props.page == props.schemas.application.pages.length - 1 &&
                <input className="btn btn-primary" type="submit" />}
        </Form>);
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
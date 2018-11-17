import React from "react";
import Modal from "react-responsive-modal";
import { connect } from "react-redux";
import { IFormState } from "../store/form/types";
import FormPage from "../FormPage/FormPage";
import { loadData, setFormName } from "../store/form/actions";
import { IAdminState } from "../store/admin/types";
import Loading from "../Loading/Loading";
import { setSelectedForm } from "../store/admin/actions";
import "./ApplicationView.scss";

const mapStateToProps = state => ({
    form: state.form,
    admin: state.admin
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    loadData: e => dispatch(loadData(e)),
    setFormName: e => dispatch(setFormName(e)),
    setSelectedForm: e => dispatch(setSelectedForm(e))
});

interface IApplicationViewProps {
    loadData: (e?) => void,
    setFormName: (e) => void,
    setSelectedForm: (e) => void,
    form: IFormState,
    admin: IAdminState
}

class ApplicationView extends React.Component<IApplicationViewProps, {}> {
    componentDidMount() {
        this.props.setFormName(this.props.admin.selectedForm.name);
        this.props.loadData(this.props.admin.selectedForm.id);
    }
    render() {
        return (<Modal
            open={true} onClose={() => this.props.setSelectedForm(null)}
            classNames={{"modal": "treehacks-application-view-modal"}}
            >
            {this.props.form.formData ? <FormPage
                submitted={true}
                onChange={e => null}
                onError={e => null}
                onSubmit={e => null}
                schema={this.props.form.schemas[this.props.form.formName].schema}
                uiSchema={this.props.form.schemas[this.props.form.formName].uiSchema}
                formData={this.props.form.formData} /> : <Loading />}
        </Modal>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationView);
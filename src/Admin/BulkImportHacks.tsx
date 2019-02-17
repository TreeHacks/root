import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps, IBulkCreateProps, IBulkImportHacksProps } from "./types";
import { performBulkCreate, setBulkCreateEmails, setBulkCreateGroup, performBulkImportHacks, setBulkImportHacks, setBulkImportHacksFloor } from "../store/admin/actions";
import { IAdminState } from "../store/admin/types";
import Form from "react-jsonschema-form";
import { FLOORS } from "../constants";

const BulkImportHacks = (props: IBulkImportHacksProps) => {
    return <div>
        <div className="row">
            <div className="form-group col-12 col-sm-6">
                <form onSubmit={e => { e.preventDefault(); props.performBulkImportHacks() }} >
                    <textarea required className="form-control" placeholder="Enter hacks, separated by newlines"
                        value={props.bulkImportHacks}
                        onChange={e => props.setBulkImportHacks(e.target.value)}>
                    </textarea>
                    Floor
                    <Form schema={{
                        "type": "number",
                        "enum": FLOORS
                    }} uiSchema={{
                    }} formData={props.bulkImportHacksFloor}
                        onChange={e => props.setBulkImportHacksFloor(parseInt(e.formData))}
                    ><div></div></Form>
                    <input className="form-control" type="submit" />
                </form>
            </div>
            <div className="col-12 col-sm-6"><small>
                <div>
                    Please enter hacks addresses, separated by newlines. (No header row; no spaces between commas). (Also, only title, devpostUrl, and categories are actually imported. Extra columns are ignored.)
                        <pre>
                        "title", "devpostUrl", "description", "video", "website", "fileUrl", "categories"{"\n"}
                        title1,https://google.com,,,,,"Best 1, Best 2, Best 3",{"\n"}
                        title2,https://google.com,,,,,"Best 1, Best 2",{"\n"}
                        ...{"\n"}
                    </pre>
                </div>
            </small></div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    ...(state.admin as IAdminState)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    performBulkImportHacks: () => dispatch(performBulkImportHacks()),
    setBulkImportHacks: e => dispatch(setBulkImportHacks(e)),
    setBulkImportHacksFloor: e => dispatch(setBulkImportHacksFloor(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkImportHacks);

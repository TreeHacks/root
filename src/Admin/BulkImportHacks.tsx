import React from "react";
import { connect } from "react-redux";
import { IStatsWrapperProps, IStatsProps, IBulkCreateProps, IBulkImportHacksProps } from "./types";
import { performBulkCreate, setBulkCreateEmails, setBulkCreateGroup, performBulkImportHacks, setBulkImportHacks } from "../store/admin/actions";
import { IAdminState } from "../store/admin/types";
import { GROUPS } from "../constants";

const BulkImportHacks = (props: IBulkImportHacksProps) => {
    return <div>
        <div className="row">
            <div className="form-group col-12 col-sm-6">
                <form onSubmit={e => { e.preventDefault(); props.performBulkImportHacks() }} >
                    <textarea required className="form-control" placeholder="Enter hacks, separated by newlines"
                        value={props.bulkImportHacks}
                        onChange={e => props.setBulkImportHacks(e.target.value)}>
                    </textarea>
                    <input className="form-control" type="submit" />
                </form>
            </div>
            <div className="col-12 col-sm-6"><small>
                <div>
                    Please enter hacks addresses, separated by newlines. (No header row). (Also, only title, devpostUrl, and categories are actually imported. Extra columns are ignored.)
                        <pre>
                        "title", "devpostUrl", "description", "video", "website", "fileUrl", "categories"{"\n"} 
                        "title1", "https://google.com", "1, 2, 3", "table123"{"\n"}
                        "title2", "https://google.com", "1, 2, 3", "table123"{"\n"}
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
    setBulkImportHacks: e => dispatch(setBulkImportHacks(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(BulkImportHacks);

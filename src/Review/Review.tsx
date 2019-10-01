import React, { Component } from 'react';
import './Review.scss';
import { API } from "aws-amplify";
import Form from "react-jsonschema-form";
import FormPage from '../FormPage/FormPage';
import { connect } from "react-redux";
import { IFormState } from '../store/form/types';
import { cloneDeep } from "lodash";
import { applicationReviewDisplayFields } from '../constants';
interface IReviewProps {
	applicationSchema: { schema: any, uiSchema: any }
}
interface IReviewComponentState {
	leaderboard_data: any[],
	application_data: { _id: string, forms: { application_info: any } },
	stats_data: any,
	reviewFormData: any
}

const schema = {
	"type": "object",
	"title": "Rate",
	"properties": {
		"cultureFit": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"experience": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"passion": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"isOrganizer": {
			"title": "is organizer",
			"type": "boolean"
		},
		"isBeginner": {
			"title": "is beginner",
			"type": "boolean"
		}
	},
	"required": ["cultureFit", "experience", "passion"]
};
const uiSchema = {
	"cultureFit": { "ui:placeholder": "culture fit" },
	"experience": { "ui:placeholder": "experience" },
	"passion": { "ui:placeholder": "passion" },
	"ui:order": ["cultureFit", "experience", "passion", "isOrganizer", "isBeginner"]
};

const mapStateToProps = state => ({
	applicationSchema: (state.form as IFormState).schemas.application_info
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});
class Review extends React.Component<IReviewProps, IReviewComponentState> {

	constructor(props) {
		super(props);
		this.state = {
			leaderboard_data: null,
			application_data: null,
			stats_data: null,
			reviewFormData: null
		}
	}

	componentDidMount() {
		this.nextApplication();
	}
	nextApplication() {
		Promise.all([
			API.get("treehacks", '/review/leaderboard', {}),
			API.get("treehacks", '/review/next_application', {}),
			API.get("treehacks", '/review/stats', {})
		]).then(([leaderboard_data, application_data, stats_data]) => {
			window.scrollTo(0, 0);
			this.setState({ leaderboard_data, application_data, stats_data, reviewFormData: null });
		}).catch((err) => {
			alert("Error, " + err);
			console.log(err);
		});
	}

	render() {
		let applicationUiSchema = cloneDeep(this.props.applicationSchema.uiSchema);
		// Hide personal information fields (it's already hidden on server side too)
		for (let field of applicationUiSchema["ui:order"]) {
			if (applicationReviewDisplayFields.indexOf(field) == -1) {
				if (!applicationUiSchema[field]) {
					applicationUiSchema[field] = {};
				}
				applicationUiSchema[field]["classNames"] = "treehacks-hidden";
			}
		}
		return (<div className="row">
			<div className="col-12 col-sm-8 offset-sm-4 review-form-container treehacks-body-text">
				<div >
					{this.state.application_data && <div className="">
						<FormPage
							submitted={true}
							onChange={e => null}
							onError={e => null}
							onSubmit={e => null}
							schema={this.props.applicationSchema.schema}
							uiSchema={applicationUiSchema}
							formData={this.state.application_data.forms.application_info} />
					</div>}
					{!this.state.application_data && <div className="treehacks-form">
						<div className="application-name">No more apps to read!</div>
						<div className="application-school">Congrats!</div>
					</div>}
				</div>
			</div>
			<div className="col-12 col-sm-4 treehacks-review-form">
				<div >
					<Form className="treehacks-form rate-form mt-0" schema={schema} uiSchema={uiSchema}
						onSubmit={e => this.handleSubmit()}
						formData={this.state.reviewFormData}
						onChange={e => this.setState({ reviewFormData: e.formData })}
					/>
				</div>
				<div className="container left-sidebar-content">
					{this.state.stats_data &&
						<div className="treehacks-body-text apps-remaining-countdown">
							<strong>{this.state.stats_data.results.num_remaining_oos}</strong> oos apps remaining<br />
							<strong>{this.state.stats_data.results.num_remaining_is}</strong> is apps remaining
						</div>}
				</div>
				<div className="container left-sidebar-content">
					<table className="table treehacks-body-text">
						<tbody>
							{this.state.leaderboard_data && this.state.leaderboard_data.map(person => <tr key={person._id}>
								<td>{(person._id || "None").replace(/@stanford.edu/, "")}</td>
								<td>{person.count}</td>
							</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
		);
	}

	handleSubmit() {
		API.post("treehacks", '/review/rate', {
			body: {
				"application_id": this.state.application_data._id,
				...this.state.reviewFormData
			}
		}).then((data) => {
			if (data.results.status === "success") {
				this.nextApplication();
			}
		}).catch(err => {
			alert("Error, " + err);
			console.error(err);
		})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
import React, { Component } from 'react';
import './Review.scss';
import API from "@aws-amplify/api";
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
	application_data: { _id: string, user: { id: string }, forms: { application_info: any } },
	stats_data: any,
	reviewFormData: any
}

const bools = {
	major_prize: 'won a prize at a major hackathon',
	minor_grand_prize: 'won a grand prize at a minor hackathon',
	tech_job: 'worked at a reputable tech company',
	personal_volume: 'completed high quantity of personal projects',
	personal_quality: 'completed a *super cool* personal project',
	research: 'conducted meaningful research',
	competition: 'performed well in CS-related competitions (usaco, battlecode, gsoc, etc.)',
	organizer: 'is a hackathon organizer',
};
Object.keys(bools).map(k => {
	bools[k] = {
		type: "boolean",
		title: bools[k]
	};
});

const schema = {
	"type": "object",
	"title": "Rate",
	"properties": Object.assign({
		"experience": {
			"type": "number",
			"enum": [1,2,3,4,5],
			"enumNames": ["1 = No experience", "2 = Intro (106/107 level and/or experience)", "3 = Intermediate (high-level classes, and/or major personal projects)", "4 = Advanced (CS research, grad courses, substantial projects, etc.)", "999 = GOD LEVEL CODER VERY RARE"]
		},
		"passion": {
			"type": "number",
			"enum": [1,2,3,4,5],
			"enumNames": ["1 = No passion demonstrated", "2 = Discussed something they’re passionate about", "3 = Passionate about something and did something about it", "4 = Passionate about something and did something major about it", "999 = GOD LEVEL PASSION VERY RARE"]
		},
		"cultureFit": {
			"type": "number",
			"enum": [1,2,3,4,5],
			"enumNames": ["1 = Not a fit", "2 = Maybe", "3 = Yes, a fit", "4 = Awesome fit!!!", "999 = GOD LEVEL FIT VERY RARE"]
		}
	}, bools),
	"required": ["experience", "passion", "cultureFit"]
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

		const uiSchema = {
			"experience": {
				"ui:placeholder": "technical experience",
			},
			"passion": {
				"ui:placeholder": "passion",
			},
			"cultureFit": {
				"ui:placeholder": "how strong of a fit for treehacks?",
			},
			"ui:order": ["experience", "passion", "cultureFit"].concat(Object.keys(bools))
		};

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
						<div className="application-name">No more apps to read :D</div>
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
				"application_id": this.state.application_data.user.id,
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
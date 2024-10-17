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
	reviewFormData: any,
	sortByRecent: boolean
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
			"enum": [1, 2, 3, 4, 5, 6],
			"enumNames": ["1 = No experience", "2 = Intro (106/107 level and/or experience)", "3 = Low-Intermediate (some projects, worked @ a tech company)", "4 = High-Intermediate (high-level classes, and/or major personal projects)", "5 = Advanced (CS research, grad courses, substantial projects, etc.)", "6 = OUTTA DIS WRLD CODER VERY RARE"]
		},
		"passion": {
			"type": "number",
			"enum": [1, 2, 3, 4, 5, 6],
			"enumNames": ["1 = No passion demonstrated", "2 = Low passion (discussed something they’re passionate about)", "3 = Somewhat Passionate (demonstrated passion, took small steps to it)", "4 = Took initiative + action steps to pursue passion", "5 = Very passionate + did something very major about it", "6 = OUTTA DIS WRLD PASSION VERY RARE"]
		},
		"cultureFit": {
			"type": "number",
			"enum": [1, 2, 3, 4, 5],
			"enumNames": ["1 = Not a fit", "2 = Maybe", "3 = Yes, a fit", "4 = Awesome fit!!!", "5 = OUTTA DIS WRLD FIT VERY RARE"]
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
			reviewFormData: null,
			sortByRecent: false,
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
	getSortedLeaderboardByRecent(leaderboard) {
		return leaderboard.concat().sort((a, b) => (a.recentCount > b.recentCount) ? -1 : 1);
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

		let applicationSchema = cloneDeep(this.props.applicationSchema.schema);
		applicationSchema.properties.hackathon_experience.title = '# hackathons attended';
		applicationSchema.properties.resume.description = null;

		const boolsKeys = Object.keys(bools);

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
			"ui:order": boolsKeys.concat(["experience", "passion", "cultureFit"])
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
							schema={applicationSchema}
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
					<Form className="treehacks-form rate-form mt-0 pt-0" schema={schema} uiSchema={uiSchema}
						onSubmit={e => this.handleSubmit()}
						formData={this.state.reviewFormData}
						onChange={e => this.setState({ reviewFormData: e.formData })}
					/>
				</div>
				<div className="container left-sidebar-content">
					{this.state.stats_data &&
						<div className="treehacks-body-text apps-remaining-countdown">
							<strong>{this.state.stats_data.results.num_remaining_oos}</strong> oos apps remaining<br />
							<strong>{this.state.stats_data.results.num_remaining_is}</strong> is apps remaining<br />
							<strong>{this.state.stats_data.results.num_remaining_stanford}</strong> stanford apps remaining
						</div>}
				</div>
				<div className="container left-sidebar-content">
					<table className="table treehacks-body-text">
						<tbody>
							<tr>
								<th>Reviewer</th>
								<th className="pointer" onClick={() => this.setState({ sortByRecent: false })}>All</th>
								{/* <th className="pointer" onClick={() => this.setState({ sortByRecent: true })}>7d</th> */}
							</tr>
							{this.state.leaderboard_data && (this.state.sortByRecent ? this.getSortedLeaderboardByRecent(this.state.leaderboard_data) : this.state.leaderboard_data).map(person => <tr key={person._id}>
								<td>{(person._id || "None").replace(/@stanford.edu/, "")}</td>
								<td>{person.count}</td>
								{/* <td>{person.recentCount}</td> */}
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

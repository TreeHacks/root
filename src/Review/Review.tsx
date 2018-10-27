import React, { Component } from 'react';
import './Review.scss';
import { API } from "aws-amplify";
import Form from "react-jsonschema-form";

interface IReviewComponentState {
	leaderboard_data: any[],
	application_data: any,
	stats_data: any
}

const schema = {
	"type": "object",
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
		"organizer": {
			"type": "boolean"
		},
		"beginner": {
			"type": "boolean"
		}
	},
	"required": ["cultureFit", "experience", "passion"]
};
const uiSchema = {
	"ui:order": ["cultureFit", "experience", "passion", "organizer", "beginner"]
};
export default class Review extends React.Component<{}, IReviewComponentState> {

	constructor(props) {
		super(props);
		this.state = {
			leaderboard_data: null,
			application_data: null,
			stats_data: null
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
			this.setState({ leaderboard_data, application_data, stats_data });
		}).catch((err) => {
			console.log(err);
		});
	}

	render() {
		return (<div id="dashboard-container">
			<div id="left-container">
				<div id="score-container">
					<Form schema={schema} uiSchema={uiSchema} onSubmit={e => this.handleSubmit(e.formData)} />
				</div>
				<div id="stats-container">
					{this.state.stats_data && <div className="leaderboard-person-container">
						<div className="stats-number"><span className="bold-number">{this.state.stats_data.results.num_remaining}</span> apps remaining</div>
					</div>}
				</div>
				<div id="leaderboard-container">
					{this.state.leaderboard_data && this.state.leaderboard_data.map(person => <div className="leaderboard-person-container">
						<div className="leaderboard-name">{person.email.replace(/@stanford.edu/, "")}</div>
						<div className='leaderboard-reads'>{person.num_reads}</div>
					</div>)}
				</div>
			</div>
			<div id="right-container">
				<div id="application-container">
					{this.state.application_data && <div className="application-question-container">
						{JSON.stringify(this.state.application_data)}
					</div>}
					{!this.state.application_data && <div className="application-question-container">
						<div className="application-name">No more apps to read!</div>
						<div className="application-school">Congrats!</div>
					</div>}
				</div>
			</div>
		</div>
		);
	}

	handleSubmit(formData) {
		API.post("treehacks", '/review/rate', {
			body: {
				"application_id": this.state.application_data._id,
				...formData
			}
		}).then((data) => {
			if (data.results.status === "success") {
				this.nextApplication();
			} else {
				alert("Error...");
			}
		})
	}
}
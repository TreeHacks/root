import React, { Component } from 'react';
import '../Review/Review.scss';
import { API } from "aws-amplify";
import Form from "react-jsonschema-form";
import FormPage from '../FormPage/FormPage';
import { connect } from "react-redux";

interface IJudgeProps {
	applicationSchema: { schema: any, uiSchema: any }
}
interface IJudgeComponentState {
	leaderboard_data: any[],
	hack_data: any, // todo: IHack
	stats_data: any,
	reviewFormData: any
}

const schema = {
	"type": "object",
	"title": "Judge",
	"properties": {
		"creativity": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"technicalComplexity": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"socialImpact": {
			"type": "number",
			"enum": [0, 1, 2, 3, 4, 5]
		},
		"comments": {
			"title": "is organizer",
			"type": "string",
			"format": "textarea"
		},
	},
	"required": ["creativity", "technicalComplexity", "socialImpact"]
};
const uiSchema = {
	"creativity": { "ui:placeholder": "creativity" },
	"technicalComplexity": { "ui:placeholder": "technical complexity" },
	"socialImpact": { "ui:placeholder": "social impact" },
	"comments": { "ui:placeholder": "comments" },
	"ui:order": ["creativity", "technicalComplexity", "socialImpact", "comments"]
};
const hackSchema = {
	"type": "object",
	"properties": {
		"_id": { "type": "string", "title": "table number" },
		"title": { "type": "string" },
		"devpostUrl": { "type": "string" },
		"categories": {
			"type": "array",
			"items": {
				"type": "string"
			},
			"uniqueItems": true,
		}
	}
};
const hackUiSchema = {
	"categories": {
		"ui:widget": "checkboxes",
		"ui:options": {
			"addable": false,
			"orderable": false,
		}
	},
	"ui:order": ["_id", "title", "devpostUrl", "categories"]
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
});
class Judge extends React.Component<IJudgeProps, IJudgeComponentState> {

	constructor(props) {
		super(props);
		this.state = {
			leaderboard_data: null,
			hack_data: null,
			stats_data: null,
			reviewFormData: null
		}
	}

	componentDidMount() {
		this.nextApplication();
	}
	nextApplication(id?: string) {
		Promise.all([
			API.get("treehacks", '/judging/next_hack', { queryStringParameters: id ? { hack_id: id } : {} }),
			API.get("treehacks", '/judging/stats', {})
		]).then(([hack_data, stats_data]) => {
			window.scrollTo(0, 0);
			this.setState({ hack_data, stats_data, reviewFormData: null });
		}).catch((err) => {
			alert("Error, " + err);
			console.log(err);
		});
	}

	render() {
		return (<div className="row">
			<div className="col-12 col-sm-8 offset-sm-4 review-form-container treehacks-body-text">
				<div className="container">
					{this.state.hack_data && <div className="">
						<FormPage
							submitted={true}
							onChange={e => null}
							onError={e => null}
							onSubmit={e => null}
							schema={hackSchema}
							uiSchema={hackUiSchema}
							formData={this.state.hack_data} />
					</div>}
					{!this.state.hack_data && <div className="treehacks-form">
						<div className="application-name">No more hacks to judge!</div>
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
					<button className="btn m-4" onClick={() => this.nextApplication()}>Skip this hack</button>
					<Form
						schema={{ "type": "number" }}
						uiSchema={{
							"classNames": "treehacks-form mt-0",
							"ui:placeholder": "Enter custom table number",
							"ui:widget": props => <div className="row">
								<input type="number"
									className="form-control float-left col-8"
									value={props.value}
									required={props.required}
									placeholder="Custom table number..."
									onChange={(event) => props.onChange(event.target.value)} />
								<input type="submit" value="Load hack" className="btn col-4"
								style={{"height": "100%", "margin": "auto"}}
								/>
							</div>
						}}
						onSubmit={e => this.nextApplication(e.formData)}>
						<div></div>
					</Form>
				</div>
				<div className="container left-sidebar-content">
					{this.state.stats_data &&
						<div className="treehacks-body-text apps-remaining-countdown">
							<strong>{this.state.stats_data.results.num_remaining}</strong> hacks remaining
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
		API.post("treehacks", '/judging/rate', {
			body: {
				"hack_id": this.state.hack_data._id,
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

export default connect(mapStateToProps, mapDispatchToProps)(Judge);
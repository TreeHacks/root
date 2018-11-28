import React from 'react';
import { connect } from 'react-redux';
import './Transportation.scss';
import { setPage, setData, saveData, loadData, getUserProfile, submitForm, setFormName, setSubformName } from "../store/form/actions";
import Loading from "../Loading/Loading";
import FormPage from '../FormPage/FormPage';
import { STATUS, TYPE, TRANSPORTATION_STATUS, TRANSPORTATION_TYPES, TRANSPORTATION_BUS_ROUTES,
  TRANSPORTATION_DEADLINES, TRANSPORTATION_BUS_ROUTE_DETAILS } from '../constants';
import { ITransportationProps } from './types';

const mapStateToProps = state => ({
    ...state.form
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: () => { dispatch(loadData()) },
  getUserProfile: () => dispatch(getUserProfile()),
  setFormName: (e: string) => dispatch(setFormName(e)),
  setSubformName: (e: string) => dispatch(setSubformName(e)),
  setData: (e, userEdited) => dispatch(setData(e, userEdited)),
  saveData: () => dispatch(saveData()),
});

class Transportation extends React.Component<ITransportationProps> {
  constructor(props) {
    super(props);

    this.submitAcceptance = this.submitAcceptance.bind(this);
  }

  componentDidMount() {
    this.props.setFormName('additional_info');
    this.props.setSubformName('transportation');
    this.props.loadData();
    this.props.getUserProfile();
  }

  submitAcceptance(accept) {
    this.props.setData({ accept }, true);
    this.props.saveData();
  }

  render() {
    if (!this.props.formData || !this.props.profile) {
        return <Loading />;
    }

    // FIXME REMOVE THIS BEFORE PROD
    if (window.location.search.indexOf('simulate=') !== -1) {
      this.props.profile.status = STATUS.ADMISSION_CONFIRMED;

      if (window.location.search.indexOf('simulate=bus') !== -1) {
        this.props.profile.admin_info.transportation = { type: TRANSPORTATION_TYPES.BUS, bus: TRANSPORTATION_BUS_ROUTES.USC };
      } else if (window.location.search.indexOf('simulate=flight') !== -1) {
        this.props.profile.admin_info.transportation = { type: TRANSPORTATION_TYPES.FLIGHT, amount: 500 };

      } else if (window.location.search.indexOf('simulate=other') !== -1) {
        this.props.profile.admin_info.transportation = { type: TRANSPORTATION_TYPES.OTHER, amount: 100 };

      }
    }
    // FIXME REMOVE THIS DEV ONLY

    const {
      status,
      type,
      admin_info: { transportation },
      transportation_status
    } = this.props.profile;

    const formattedDeadline = new Date((transportation && transportation.deadline) || Date.now()).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    const transportationType = (transportation && transportation.type) || TRANSPORTATION_TYPES.NONE;
    const transportationAmount = (transportation && transportation.amount) || 0;
    let transportationForm = this.props.formData || {};

    if (status === STATUS.ADMISSION_CONFIRMED || status === STATUS.ADMITTED) {

      if (transportationType === TRANSPORTATION_TYPES.NONE) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '700px', marginTop: '60px', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
              <h5>You have not been given a travel reimbursement.</h5>
              <p style={{maxWidth: 500, margin: '20px auto 0'}}>It looks like you're coming from close by, so we aren't planning to coordinate travel for you. Let us know if we made a mistake!</p>
            </div>
          </div>
        );

      } else if (transportationType === TRANSPORTATION_TYPES.BUS) {
        const route = TRANSPORTATION_BUS_ROUTE_DETAILS[transportation.bus] || [];

        return (
          <div className="transportation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '700px', margin: '60px', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
              <h5>You have been placed on a bus!</h5>
              <p style={{maxWidth: 500, margin: '20px auto 0'}}>We are running free buses from locations in California, and we would like you to offer a spot on one :) Buses leave on Friday morning and return Sunday night. If you would like a spot on the bus listed below, you must RSVP on this page by <strong>{formattedDeadline}</strong>. The bus will be first come, first served, but this shows us approximately how many seats we need. If you do not fill out this form, you will *not *be allowed to board the bus. Because you are near a bus, we do not anticipate offering you other travel reimbursement options.</p>
              <p style={{maxWidth: 500, margin: '20px auto 0'}}>You <strong>must</strong> have a <u><strong>government-issued ID</strong></u> to get on the bus (this is because you must have one to check-in at TreeHacks!). Your bus coordinators will be checking IDs, and they will not be able to save a spot for you if you forget your ID. Because the bus is first come, first served, we recommend getting to your pickup spot early during the check in process. Buses depart 30 minutes after check-in begins or until spots are filled, whichever is first. Times on this page are tentative until February 1st.</p>

              <div style={{margin: 40, padding: 20, backgroundColor: '#535152'}}>
                <p><small>We will add information for your bus coordinator in the weeks leading up to the event. If you have questions in the meantime, please reach out to hello@treehacks.com.</small></p>
                <div className="route">
                  {route.map(({ day, time, stop, location, hack }) => {
                    return (
                      <div key={`${day}${time}`} className="entry">
                        <div className="left">
                          <div className="time">{time}</div>
                          <div className="day">{day}</div>
                        </div>
                        <div className="right">
                          <div className="stop">{hack ? 'Hack, hack, hack!' : stop}</div>
                          <div className="location">{location}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <h5>{transportationForm.accept ? "Thanks, we've received your RSVP" :  <span>You must RSVP by <strong>{formattedDeadline}</strong></span>}</h5>

              {status === STATUS.ADMITTED ?
                <p style={{maxWidth: 575, margin: '20px auto 0'}}>After you confirm your spot using the dashboard, you can use this page to submit your RSVP and reserve your spot on the bus.</p>
              :
                <div className="btn-container" style={{marginBottom: 0}}>
                    <div>
                        <input
                            className="btn btn-custom inverted"
                            type="submit"
                            value="cancel RSVP"
                            style={!transportationForm.accept ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                            disabled={!transportationForm.accept}
                            onClick={e => { e.preventDefault(); this.submitAcceptance(false); }}
                        />
                        <input
                            className="btn btn-custom"
                            type="submit"
                            value="RSVP"
                            onClick={e => { e.preventDefault(); this.submitAcceptance(true); }}
                        />
                    </div>
                </div>
              }

              {transportationForm.accept ?
                <p><small>We've received your RSVP! You can change your status anytime up to the event if your plans change.</small></p>
              : null}
            </div>
          </div>
        );

      } else if (transportationType === TRANSPORTATION_TYPES.FLIGHT || transportationType === TRANSPORTATION_TYPES.OTHER) {
        return (
          <div className="transportation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '750px', margin: '60px', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
              
              {transportationType === TRANSPORTATION_TYPES.FLIGHT ?
                <div>
                  <h5>You have received a flight reimbursement!</h5>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>We have calculated your flight cap based on the location in your application. We will reimburse the cost of your flight, up to this amount. <strong>If you do not upload your receipts by the deadline, we will assume you are declining the reimbursement, and you will not be reimbursed.</strong></p>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>Here are the guidelines you need to follow in order to receive a reimbursement:</p>
                  <ul style={{textAlign: 'left', margin: '20px auto', maxWidth: 575}}>
                    <li>Attend TreeHacks 2019 :)</li>
                    <li>Submit a project by the project deadline the weekend-of.</li>
                    <li>Submit your flight receipts by the deadline listed on this page. We will only be able to reimburse your reimbursement if they are submitted by then.</li>
                    <li>Follow any and all TreeHacks rules &amp; the MLH Code of Conduct.</li>
                  </ul>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>We recommend flying into SJC, SFO, or OAK; these are the closest  airports to Stanford (in that order). Please arrange for transportation  to bring you to the venue from the airport on Friday afternoon. Plan for your flight to arrive Friday afternoon by 3pm. This will allow  for you to get to Stanford on time for dinner and other goodies we have  planned. On Sunday, expect to leave the venue around 4pm, after closing ceremony.</p>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>In the case that your current flight cap prevents you from attending TreeHacks or is significantly off the mark of flight prices that you're able to find, please reach out to us at hello@treehacks.com,  and we will work something out. Our hope is to remove any and all  barriers that could prevent you from coming out to TreeHacks!</p>
                </div>
              :
                <div>
                  <h5>You have received a travel reimbursement!</h5>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>We have calculated your reimbursement amount based on the location in your application. We will reimburse the cost of your travel, up to this amount. It is up to you to decide how you get to Stanford, whether that's driving, public transportation, or another method. You must upload your receipts by the deadline listed on this page, or we will not be able to process your reimbursement.</p>
                  <p style={{maxWidth: 575, margin: '20px auto'}}>Here are the guidelines you need to follow in order to receive a reimbursement:</p>
                  <ul style={{textAlign: 'left', margin: '20px auto', maxWidth: 575}}>
                    <li>Attend TreeHacks 2019 :)</li>
                    <li>Submit a project by the project deadline the weekend-of.</li>
                    <li>Submit your receipts by the deadline listed on this page. We will only be able to reimburse your reimbursement if they are submitted by then.</li>
                    <li>Follow any and all TreeHacks rules &amp; the MLH Code of Conduct.</li>
                  </ul>
                </div>
              }

              <h5 style={{marginTop: 40}}>{transportationForm.accept ? "Thanks, we've received your receipt" :  <span>Receipts must be uploaded by <strong>{formattedDeadline}</strong></span>}</h5>
              <h5>TreeHacks is reimbursing you up to <span style={{color: '#00b65f', fontWeight: 'bold'}}>${transportationAmount}</span></h5>
              
              {status === STATUS.ADMITTED ?
                <p style={{maxWidth: 575, margin: '20px auto 0'}}>After you confirm your spot using the dashboard, you can use this page to upload your receipts and request reimbursement.</p>
              : transportationForm.accept ?
                <p style={{maxWidth: 575, margin: '20px auto 0'}}>Thanks, we've received your reimbursement request.</p>
              :
                <div>
                  <p style={{maxWidth: 575, margin: '20px auto -20px', fontStyle: 'italic'}}>If you have multiple receipts, please combine them into a single PDF prior to uploading. You can only submit this form once.</p>
                  <FormPage
                    submitted={false}
                    onChange={e => {
                        const userEdited = JSON.stringify(e.formData) !== JSON.stringify(transportationForm);
                        this.props.setData(e.formData, userEdited);
                    }}
                    onError={() => window.scrollTo(0, 0)}
                    onSubmit={(e) => {
                      e.formData.accept = true;
                      this.props.setData(e.formData, true);
                      this.props.saveData();
                    }}
                    schema={this.props.schemas.reimbursement_info.schema}
                    uiSchema={this.props.schemas.reimbursement_info.uiSchema}
                    formData={transportationForm}
                    actionButtons={
                      <div className="btn-container" style={{marginBottom: 0}}>
                        <div>
                          <input
                            className="btn btn-custom"
                            type="submit"
                            value="submit receipt"
                          />
                        </div>
                      </div>
                    }
                  />
                </div>
              }
            </div>
          </div>
        );
      }

    } else {
      // No travel info to show
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#686e77', width: '100%', maxWidth: '500px', marginTop: '60px', padding: '20px', color: 'white', textAlign: 'center' }}>
            There are no travel options at this time. Check back after you have received a decision about your application.
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transportation);

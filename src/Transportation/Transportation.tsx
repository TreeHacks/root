import React from "react";
import { connect } from "react-redux";
import "./Transportation.scss";
import {
  setPage,
  setData,
  saveData,
  loadData,
  getUserProfile,
  submitForm,
  setFormName,
} from "../store/form/actions";
import Loading from "../Loading/Loading";
import FormPage from "../FormPage/FormPage";
import {
  STATUS,
  TYPE,
  TRANSPORTATION_STATUS,
  TRANSPORTATION_TYPES,
  TRANSPORTATION_BUS_ROUTES,
  TRANSPORTATION_DEADLINES,
  TRANSPORTATION_BUS_ROUTE_DETAILS,
} from "../constants";
import { ITransportationProps } from "./types";
import RouteMap from "./RouteMap";
import FlightReimbursementHeader from "./FlightReimbursementHeader";
import moment from "moment-timezone";
import TravelReimbursementHeader from "./TravelReimbursementHeader";
import TransportationExpired from "./TransportationExpired";

declare var MODE: string;

const mapStateToProps = (state) => ({
  ...state.form,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadData: () => {
    dispatch(loadData());
  },
  getUserProfile: () => dispatch(getUserProfile()),
  setFormName: (e: string) => dispatch(setFormName(e)),
  setData: (e, userEdited) => dispatch(setData(e, userEdited)),
  saveData: () => dispatch(saveData()),
  submitForm: () => dispatch(submitForm()),
});

export class Transportation extends React.Component<ITransportationProps> {
  constructor(props) {
    super(props);

    this.submitBusAcceptance = this.submitBusAcceptance.bind(this);
  }

  submitBusAcceptance(accept, deadlinePassed) {
    if (
      !deadlinePassed ||
      window.confirm(
        "Are you sure you want to decline your RSVP? Since the transportation deadline has passed, this will be final."
      )
    ) {
      this.props.setData({ accept }, true);
      this.props.saveData();
    }
  }

  render() {
    if (MODE === "DEV") {
      if (window.location.search.indexOf("simulate=") !== -1) {
        this.props.profile.status = STATUS.ADMISSION_CONFIRMED;

        if (window.location.search.indexOf("simulate=bus") !== -1) {
          this.props.profile.admin_info.transportation = {
            type: TRANSPORTATION_TYPES.BUS,
            id: TRANSPORTATION_BUS_ROUTES.USC,
            deadline: "2048-11-28T04:39:47.512Z",
          };
        } else if (window.location.search.indexOf("simulate=flight") !== -1) {
          this.props.profile.admin_info.transportation = {
            type: TRANSPORTATION_TYPES.FLIGHT,
            amount: 500,
            deadline: "2048-11-28T04:39:47.512Z",
          };
        } else if (window.location.search.indexOf("simulate=other") !== -1) {
          this.props.profile.admin_info.transportation = {
            type: TRANSPORTATION_TYPES.OTHER,
            amount: 100,
            deadline: "2048-11-28T04:39:47.512Z",
          };
        }
      }
    }

    const {
      status,
      type,
      admin_info: { transportation },
      transportation_status,
    } = this.props.profile;

    const transportationDeadline = moment(
      transportation && transportation.deadline
    );
    const formattedDeadline = transportationDeadline
      .tz("America/Los_Angeles")
      .format("LLL z");
    const transportationType = (transportation && transportation.type) || "";
    const transportationAmount = (transportation && transportation.amount) || 0;
    const dateNow = moment();
    const deadlinePassed = dateNow > transportationDeadline;
    let transportationForm = this.props.formData || {};

    if (status !== STATUS.ADMITTED && status !== STATUS.ADMISSION_CONFIRMED) {
      // No travel info to show
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="treehacks-alert"
            style={{ maxWidth: "500px", margin: "60px 0 0 0", padding: "20px" }}
          >
            <span>There are no travel options at this time.&nbsp;</span>
            {status !== STATUS.ADMISSION_DECLINED && (
              <span>
                Check back after you have received a decision about your
                application.
              </span>
            )}
            {status === STATUS.ADMISSION_DECLINED && (
              <span>
                You have declined your admission, so no transportation options
                are available.
              </span>
            )}
          </div>
        </div>
      );
    }
    if (transportation_status === TRANSPORTATION_STATUS.UNAVAILABLE || transportationType === TRANSPORTATION_TYPES.OTHER) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="treehacks-alert"
            style={{ maxWidth: "700px", padding: "40px 20px" }}
          >
            <h4>You have not been given a travel reimbursement.</h4>
            <p style={{ maxWidth: 500, margin: "20px auto 0" }}>
              It looks like you're coming from close by, so we aren't planning
              to coordinate travel for you. Let us know if we made a mistake!
            </p>
          </div>
        </div>
      );
    }

    if (transportationType === TRANSPORTATION_TYPES.BUS) {
      const busRouteInfo = TRANSPORTATION_BUS_ROUTE_DETAILS[
        transportation.id
      ] || { coordinator: null, route: [] };

      if (deadlinePassed && transportationForm.accept !== true) {
        return (
          <div
            className="transportation"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="treehacks-alert">
              <TransportationExpired />
            </div>
          </div>
        );
      }

      return (
        <div
          className="transportation"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="treehacks-alert">
            <h4>You have been placed on a bus!</h4>
            <p style={{ maxWidth: 575, margin: "20px auto 0" }}>
              We are running free buses from locations in California, and we
              would like you to offer a spot on one :) Buses leave on Friday
              morning and return Sunday night. If you would like a spot on the
              bus listed below, you must RSVP on this page by{" "}
              <strong>{formattedDeadline}</strong>. The buses will be first
              come, first serve, but this shows us approximately how many seats
              we need. If you do not fill out this form, you will{" "}
              <u>
                <strong>not</strong>
              </u>{" "}
              be allowed to board a bus. Because you are near a bus, we do not
              anticipate offering you other travel reimbursement options.
            </p>
            <p style={{ maxWidth: 575, margin: "20px auto 0" }}>
              You{" "}
              <u>
                <strong>must</strong>
              </u>{" "}
              have a{" "}
              <u>
                <strong>government-issued ID</strong>
              </u>{" "}
              to get on the bus. Your bus coordinators will be checking IDs, and
              they will not be able to save a spot for you if you forget your
              ID. Because the buses are first come, first serve, we recommend
              getting to your pickup spot early during the check in process.
              Buses depart 30 minutes after check-in begins or until spots are
              filled, whichever is first. Please check back on February 1st for
              more details about the specific times and locations of your bus.
            </p>
            
            <h5>
              {transportationForm.accept ? (
                "Thanks, we've received your RSVP"
              ) : (
                <span>
                  You must RSVP by <strong>{formattedDeadline}</strong>
                </span>
              )}
            </h5>

            {status === STATUS.ADMITTED ? (
              <p style={{ maxWidth: 575, margin: "20px auto 0" }}>
                After you confirm your spot using the dashboard, you can use
                this page to submit your RSVP and reserve your spot on the bus.
              </p>
            ) : (
              <div className="btn-container" style={{ marginBottom: 0 }}>
                <div>
                  <input
                    className="btn btn-custom inverted"
                    type="submit"
                    value="cancel RSVP"
                    style={
                      !transportationForm.accept
                        ? { opacity: 0.5, pointerEvents: "none" }
                        : {}
                    }
                    disabled={!transportationForm.accept}
                    onClick={(e) => {
                      e.preventDefault();
                      this.submitBusAcceptance(false, deadlinePassed);
                    }}
                  />
                  <input
                    className="btn btn-custom"
                    type="submit"
                    value="RSVP"
                    disabled={transportationForm.accept}
                    onClick={(e) => {
                      e.preventDefault();
                      this.submitBusAcceptance(true, deadlinePassed);
                    }}
                  />
                </div>
              </div>
            )}
            {transportationForm.accept ? (
              <p>
                <small>
                  We've received your RSVP! You can cancel your RSVP anytime up
                  to the event if your plans change.
                </small>
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    if (
      transportationType === TRANSPORTATION_TYPES.FLIGHT ||
      transportationType === TRANSPORTATION_TYPES.TRAIN
    ) {
      if (
        dateNow > transportationDeadline &&
        transportation_status === TRANSPORTATION_STATUS.AVAILABLE
      ) {
        return <TransportationExpired />;
      }

      return (
        <div
          className="transportation"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="treehacks-alert">
            <h5>
              TreeHacks is reimbursing you up to{" "}
              <span className="treehacks-transportation-amount-text">
                {transportationAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
              {" "}for your{" "}
              {transportationType === TRANSPORTATION_TYPES.TRAIN ? "train" : "flight"}
            </h5>
            <FlightReimbursementHeader />
          </div>
        </div>
      );
    }
  }
}

class TransportationWrapper extends React.Component<ITransportationProps, {}> {
  componentDidMount() {
    this.props.setFormName("transportation");
    this.props.loadData();
    this.props.getUserProfile();
  }
  render() {
    if (!this.props.formData || !this.props.profile) {
      return <Loading />;
    }
    return <Transportation {...this.props} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransportationWrapper);

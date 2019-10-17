import React from 'react';
import API from "@aws-amplify/api";
import { connect } from 'react-redux';
import './Rooms.scss';
import { setPage, setData, saveData, loadData, getUserProfile, submitForm, setFormName } from "../store/form/actions";
import Loading from "../Loading/Loading";
import FormPage from '../FormPage/FormPage';
import { IRoomsProps, IRoomsState } from './types';
import moment from "moment-timezone";

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export class Rooms extends React.Component<IRoomsProps, IRoomsState> {
  _clockInterval: number;
  _fetchInterval: number;

  constructor(props) {
    super(props);

    this.state = {
      now: Date.now(),
      currentRoom: null,
      rooms: []
    };

    this._updateFromApi = this._updateFromApi.bind(this);
  }

  componentDidMount() {
    this.refresh();
    this._clockInterval = window.setInterval(() => this.setState({ now: Date.now() }), 1000);
    this._fetchInterval = window.setInterval(() => this.refresh(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this._clockInterval);
    clearInterval(this._fetchInterval);
  }

  _updateFromApi({ current_room, rooms }) {
    if (current_room) { current_room.expiry = new Date(current_room.expiry); }
    rooms.forEach(r => r.expiry = new Date(r.expiry));

    this.setState({ currentRoom: current_room, rooms });
  }

  refresh() {
    API.get("treehacks", `/rooms`, {})
      .then(this._updateFromApi)
      .catch(e => alert(`Couldn't fetch rooms: ${e.response.data.message}`));
  }

  onReserve(id, e) {
    e.preventDefault();
    API.post("treehacks", `/rooms`, { body: { room: id } })
      .then(this._updateFromApi)
      .catch(e => alert(`Couldn't reserve room: ${e.response.data.message}`));
  }

  onCancel() {
    if (!window.confirm('just making sure—are you sure you\'d like to drop this room? thanks for being so considerate and giving other hackers a chance!')) { return; }

    API.del("treehacks", `/rooms`, {})
      .then(this._updateFromApi)
      .catch(e => alert(`Couldn't drop room: ${e.response.data.message}`));
  }

  _formatTimeDelta(delta: number) {
    if (delta < 0) { delta = 0; }
    const pad = (d) => Math.floor(d).toString().padStart(2, "0");
    return `${pad(delta / 60)}:${pad(delta % 60)}`;
  }

  render() {
    const { now, rooms, currentRoom } = this.state;

    return (
      <div className="rooms" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="treehacks-alert" style={{ maxWidth: '750px' }}>
          <div>
            Sometimes, you need private space for your team to work. Now you can have it! So that we can keep offering dedicated room space, make sure you follow the rules:
            <ul className="rules">
              <li>Only reserve a room if your team <u>truly needs one</u>.</li>
              <li>Don't reserve the same room multiple times in a row.</li>
              <li>Room reservations last for <u>one hour</u> and are first-click-first-serve. If you finish early, drop your reservation so that others can use the room!</li>
              <li>Don't "game the system" by having different team members reserve in sequence. Not only is this morally reprehensible, we'll also be checking during judging <code style={{color: '#fff'}}>;)</code></li>
            </ul>
          </div>

          <div>
            <h3>Your current room</h3>
            {currentRoom ?
              <div className="rooms">
                <div>
                  <div>{currentRoom.name}</div>
                  <div>
                    expires in {this._formatTimeDelta((+currentRoom.expiry - now) / 1000)}, or&nbsp;
                    <a href="#" onClick={this.onCancel.bind(this)}>drop now</a>
                  </div>
                </div>
              </div>
            :
              <div>You have no currently reserved room.</div>
            }
          </div>

          <div>
            <h3>Available rooms</h3>
            <div className="rooms">
              {rooms.map(({ id, name, expiry, next_unavailable, error }) => {
                const delta = (+expiry - now) / 1000;
                return (
                  <div>
                    <div>
                      {name}
                      {next_unavailable ?
                        <small>"{next_unavailable.label}" begins here in {this._formatTimeDelta((+new Date(next_unavailable.start) - now) / 1000)}</small>
                      : null}
                    </div>
                    <div>{
                      error ?
                        `${error.replace(/%EXPIRY%/g, moment(expiry).format('h:mma'))}`
                      : currentRoom ?
                        `you already have a room!`
                      : (!expiry || delta <= 0) ?
                        <a href="#" onClick={this.onReserve.bind(this, id)}>reserve now!</a>
                      :
                        `reserved, expires in ${this._formatTimeDelta(delta)}`
                    }</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class RoomsWrapper extends React.Component<IRoomsProps, {}> {
  render() {
      if (false) {
        return <Loading />;
      }
      return <Rooms {...this.props}  />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomsWrapper);

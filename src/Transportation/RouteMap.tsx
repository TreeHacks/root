import React from "react";
import { IBusRoute } from "../constants";

interface IRouteMapProps {
    route: IBusRoute[]
}

export default (props: IRouteMapProps) => (<div className="route">
    {props.route.map(({ day, time, stop, location, hack }) => {
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
</div>);
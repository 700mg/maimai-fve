import React from 'react';

export default class PlayersInfo extends React.Component {
    constructor(arg) {
        super(arg);
    }

    render() {
        return (
            <div className="players_info_body">
                <div className="players_info_box_inner player_info">
                    <div className="player_info_label">YOU<div className="maimai_rate">({this.props.self_rate})</div></div>
                    <div className="player_info_name">{this.props.self_name}</div>
                </div>
                <div className="players_info_box_inner player_kokonoclassname_dousiyo">vs</div>
                <div className="players_info_box_inner player_info">
                    <div className="player_info_label">RIVAL<div className="maimai_rate">({this.props.rival_rate})</div></div>
                    <div className="player_info_name">{this.props.rival_name}</div>
                </div>
            </div>
        );
    }
}
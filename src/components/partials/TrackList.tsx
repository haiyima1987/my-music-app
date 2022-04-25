import * as React from 'react';
import { connect } from "react-redux";

interface Props {
  tracks: Array<any>
}

const HEAD_VALUES = ['#', 'Image', 'Name', 'Artists', 'Album', 'Duration'];

class TrackList extends React.Component<Props> {
  getImage = (track: any) => {
    if (track.album.images.length > 0) {
      return track.album.images[0].url;
    }
    return require('../../assets/img/avatar_spotify.png');
  }

  getDuration = (track: any) => {
    const ms = track.duration_ms;
    const seconds = parseInt((ms / 1000).toString());
    const mins = parseInt((seconds / 60).toString());
    const extra = seconds % 60;
    return `${mins}:${extra < 10 ? `0${extra}` : extra}`;
  }

  render() {
    return (
      <div className="track-list-section-wrapper">
        <div className="track-list-wrapper">
          <table className="table-track-list custom-table">
            <thead className="head-custom-table">
            <tr className="tr-table-track-list row-custom-table">
              {HEAD_VALUES.map((value, index) => {
                return <td key={index} className="td-table-track-list cell-custom-table">{value}</td>
              })}
            </tr>
            </thead>
            <tbody>
            {this.props.tracks.map((track, index) => {
              return <tr key={index} className="tr-table-track-list row-custom-table">
                <td className="td-table-track-list cell-custom-table">{index + 1}</td>
                <td className="td-table-track-list cell-custom-table">
                  <div className="track-list-image-wrapper">
                    <img src={this.getImage(track)}
                         className="image-track-list"
                         alt="track-image"/>
                  </div>
                </td>
                <td className="td-table-track-list cell-custom-table">{track.name}</td>
                <td className="td-table-track-list cell-custom-table">{track.artists[0].name}</td>
                <td className="td-table-track-list cell-custom-table">{track.album.name}</td>
                <td className="td-table-track-list cell-custom-table td-duration">
                  <span className="text-duration">{this.getDuration(track)}</span>
                  <span className="icon-play-box">
                    <a href={track.external_urls.spotify} target="_blank">
                      <img src={require('../../assets/img/icon_play.jpg')} alt="icon-play"
                           className="icon-play"/>
                    </a>
                  </span>
                </td>
              </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect()(TrackList);

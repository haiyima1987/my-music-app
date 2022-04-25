import * as React from 'react';
import { connect } from "react-redux";
import ArtistItem from "./ArtistItem";

interface Props {
  artists: Array<any>;
  itemsPerRow: number;
}

class ArtistList extends React.Component<Props> {
  render() {
    return (
      <div className="artist-list-section-wrapper">
        <div className="artist-list-wrapper">
          {this.props.artists.map((artist, index) => {
            return <ArtistItem
              key={index}
              artist={artist}
              itemsPerRow={this.props.itemsPerRow}/>;
          })}
        </div>
      </div>
    );
  }
}

export default connect()(ArtistList);

import * as React from 'react';
import { connect } from "react-redux";
import AlbumItem from "./AlbumItem";

interface Props {
  albums: Array<any>;
  itemsPerRow: number;
}

class ArtistList extends React.Component<Props> {
  render() {
    return (
      <div className="artist-list-section-wrapper">
        <div className="artist-list-wrapper">
          {this.props.albums.map((album, index) => {
            return <AlbumItem
              key={index}
              album={album}
              itemsPerRow={this.props.itemsPerRow}/>;
          })}
        </div>
      </div>
    );
  }
}

export default connect()(ArtistList);

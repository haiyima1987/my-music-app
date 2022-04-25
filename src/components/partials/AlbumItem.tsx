import * as React from 'react';
import { connect } from "react-redux";
import { RefObject } from "react";
import ImageLoader from "../ImageLoader";

interface Props {
  album: any;
  itemsPerRow: number;
}

class AlbumItem extends React.Component<Props> {
  readonly imageRef: RefObject<HTMLImageElement>;

  constructor(props: Props) {
    super(props);
    this.imageRef = React.createRef();
  }

  getFlexValue = () => {
    return `0 0 ${(1 / this.props.itemsPerRow * 100).toFixed(4)}%`;
  }

  getImage = (album: any) => {
    if (album.images.length > 0) {
      return album.images[0].url;
    }
    return require('../../assets/img/avatar_spotify.png');
  }

  render() {
    const {album} = this.props;

    return (
      <div style={{flex: this.getFlexValue()}} className="album-item-wrapper">
        <a href={album.external_urls.spotify} target="_blank" className="link-list-item">
          <div className="album-item-box">
            <ImageLoader
              wrapperClass="album-item-image-wrapper"
              image={this.getImage(album)}
              alt="profile-image"
              imageClass="image-album-item"
            />
            <div className="album-item-title-wrapper">
              {album.name}
            </div>
            <div className="album-item-text-wrapper">
              {album.release_date} • {album.artists[0].name}
            </div>
          </div>
        </a>
      </div>
    );
  }
}

export default connect()(AlbumItem);

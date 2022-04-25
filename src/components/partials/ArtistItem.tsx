import * as React from 'react';
import { connect } from "react-redux";
import { RefObject } from "react";
import ImageLoader from "../ImageLoader";

interface Props {
  artist: any;
  itemsPerRow: number;
}

class ArtistItem extends React.Component<Props> {
  readonly imageRef: RefObject<HTMLImageElement>;

  constructor(props: Props) {
    super(props);
    this.imageRef = React.createRef();
  }

  getFlexValue = () => {
    return `0 0 ${(1 / this.props.itemsPerRow * 100).toFixed(4)}%`;
  }

  getImage = (artist: any) => {
    if (!artist.external_urls || !artist.external_urls.spotify) {
      console.log('null');
    }
    if (artist.images.length > 0) {
      return artist.images[0].url;
    }
    return require('../../assets/img/avatar_spotify.png');
  }

  render() {
    const {artist} = this.props;

    return (
      <div style={{flex: this.getFlexValue()}} className="artist-item-wrapper">
        <a href={artist.external_urls.spotify} target="_blank" className="link-list-item">
          <div className="artist-item-box">
            <ImageLoader
              wrapperClass="artist-item-image-wrapper"
              image={this.getImage(artist)}
              alt="profile-image"
              imageClass="image-artist-item"
            />
            <div className="artist-item-title-wrapper">
              {artist.name}
            </div>
            <div className="artist-item-text-wrapper">
              Followers: {artist.followers.total}
            </div>
          </div>
        </a>
      </div>
    );
  }
}

export default connect()(ArtistItem);

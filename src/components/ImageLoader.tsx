import * as React from "react";
import { RefObject } from "react";
import { connect } from "react-redux";

interface Props {
  image: string;
  alt: string;
  wrapperClass: string;
  imageClass: string;
}

class ImageLoader extends React.Component<Props> {
  readonly imageRef: RefObject<HTMLImageElement>;

  constructor(props: Props) {
    super(props);
    this.imageRef = React.createRef();
  }

  getImageStyle = () => {
    let width = '100%';
    let height = 'auto';
    const image = this.imageRef.current!;
    if (image!.width > image.height) {
      width = 'auto'
      height = '100%';
    }
    image.style.setProperty('width', width);
    image.style.setProperty('height', height);
  }

  render() {
    const {image, alt, wrapperClass, imageClass} = this.props;

    return (
      <div className={wrapperClass}>
        <img src={image}
             onLoad={this.getImageStyle}
             ref={this.imageRef}
             alt={alt}
             className={imageClass}/>
      </div>
    );
  }
}

export default connect()(ImageLoader);

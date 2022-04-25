import * as React from 'react';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  callback: Function;
}

interface State {
  selectedItem: string;
  height: number;
}

const TYPES = ["track", "artist", "album"];

class SelectField extends React.Component<Props, State> {
  readonly selectList: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.selectList = React.createRef();
    this.state = {
      selectedItem: TYPES[0],
      height: 0
    }
  }

  componentDidMount() {
    this.props.callback(TYPES[0]);
  }

  onItemClick = (e: any, type: string) => {
    e.stopPropagation();
    this.setState({selectedItem: type});
    this.props.callback(type);
    this.collapseSelectList();
  }

  toggleSelectList = () => {
    const height = this.state.height === 0 ? this.selectList.current!.offsetHeight : 0;
    this.setState({height});
  }

  collapseSelectList = () => {
    this.setState({height: 0});
  }

  render() {
    return (
      <div className="type-select-box">
        <div onClick={this.toggleSelectList}
             className="type-select-result">
          {this.state.selectedItem.toUpperCase()}
          <FontAwesomeIcon icon={faChevronDown} className="fa-chevron-down icon-type-select"/>
        </div>
        <div style={{height: `${this.state.height}px`}}
             className="type-select-list-wrapper">
          <div ref={this.selectList}
               className="type-select-list-box">
            {TYPES.map((type, index) => {
              return <div key={index}
                          onClick={(e) => this.onItemClick(e, type)}
                          className={`type-select-list-item ${this.state.selectedItem === type ? 'active' : ''}`}>
                {type.toUpperCase()}
              </div>
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectField;

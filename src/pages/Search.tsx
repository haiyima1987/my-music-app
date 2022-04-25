import * as React from 'react';
import { connect } from "react-redux";
import { StoreRootState } from "../store";
import SearchField from "../components/SearchField";
import { getTracksByParams } from "../store/track/actions";
import SelectField from "../components/SelectField";
import ArtistList from "../components/partials/ArtistList";
import TrackList from "../components/partials/TrackList";
import AlbumList from "../components/partials/AlbumList";
import ScrollController from "../components/ScrollController";
import { RouteComponentProps } from "react-router";
import NoResult from "../components/partials/NoResult";
import { RESULT_TYPES } from "../models/DomHelpers";

interface Props {
  isAuthenticated?: boolean;
  setLogin: Function;
  history: RouteComponentProps["history"];
  getTracksByParams: Function;
}

interface State {
  listData?: Array<any>;
  type?: string;
  enableScroll: boolean;
}

const mapStateToProps = (state: StoreRootState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

const KEY_MAP: { [key: string]: any } = {
  'artist': 'artists',
  'track': 'tracks',
  'album': 'albums'
}

const SCROLL_DELAY = 1000;

class Search extends React.Component<Props, State> {
  /** search params **/
  private searchParams: { [key: string]: any } = {
    searchTerm: '',
    type: '',
    rowsPerCall: 6,
    itemsPerRow: 8,
    limit: 50,
    offset: 0,
    current: 0,
    total: -1
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      listData: undefined,
      type: undefined,
      enableScroll: false
    }
    this.searchParams.itemsPerRow = this.getItemsPerRow();
  }

  /** pagination functions **/
  getItemsPerRow = () => {
    let num = 2;
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      num = 4;
    } else if (window.innerWidth >= 1024 && window.innerWidth < 1200) {
      num = 4;
    } else if (window.innerWidth >= 1200 && window.innerWidth < 1600) {
      num = 5;
    } else if (window.innerWidth >= 1600) {
      num = 6;
    }
    return num;
  }

  /** reset for each new search **/
  resetPagination = () => {
    this.searchParams = Object.assign({}, this.searchParams, {
      rowsPerCall: 6,
      itemsPerRow: this.getItemsPerRow(),
      limit: 50,
      offset: 0,
      current: 0,
      total: -1
    });
  }

  initializePagination = () => {
    /** modify offset and limit for the new call **/
    this.searchParams.limit = this.searchParams.rowsPerCall * this.searchParams.itemsPerRow;
    this.searchParams.offset = this.searchParams.current * this.searchParams.limit;
  }

  updatePagination = (offset: number, total: number) => {
    /** update for pagination **/
    this.searchParams = Object.assign({}, this.searchParams, {
      current: this.searchParams.current + 1,
      total
    })
  }

  /** api call to get tracks **/
  getTracks = () => {
    this.resetPagination();
    this.getTrackListByParams().then((items: any) => {
      /** set data for DOM rendering **/
      this.setState({
        listData: items,
        type: this.searchParams.type
      });
      /** enable scroll after a little bit of delay for DOM to render, also avoid too many calls fired **/
      setTimeout(() => {
        this.setState({enableScroll: true});
      }, SCROLL_DELAY);
    });
  };

  getMoreTracks = () => {
    this.setState({
      enableScroll: false
    })
    this.getTrackListByParams().then((items: any) => {
      this.setState({
        listData: this.state.listData!.concat(items),
        type: this.searchParams.type
      });
      setTimeout(() => {
        this.setState({enableScroll: true});
      }, SCROLL_DELAY);
    });
  }

  getTrackListByParams = () => {
    this.initializePagination();
    return this.props.getTracksByParams(this.searchParams).then((response: any) => {
      const {items, total, offset} = response[KEY_MAP[this.searchParams.type]];
      /** Set pagination for load more **/
      this.updatePagination(offset, total);
      /** Set the data and enable scroll control **/
      return items;
    });
  }

  /** search field and select field **/
  setSearchTerm = (searchTerm: string) => {
    this.searchParams.searchTerm = searchTerm;
  }

  setSelectedType = (type: string) => {
    this.searchParams.type = type;
  }

  /** template **/
  getListTemplate = (listData: any) => {
    if (listData.length === 0) return <NoResult type={RESULT_TYPES.NO_RESULT}/>
    let domList = <TrackList tracks={listData}/>
    if (this.state.type === 'artist') {
      domList = <ArtistList artists={listData} itemsPerRow={this.searchParams.itemsPerRow}/>
    } else if (this.state.type === 'album') {
      domList = <AlbumList albums={listData} itemsPerRow={this.searchParams.itemsPerRow}/>
    }
    return domList;
  }

  render() {
    return (
      <div className="search-page-wrapper">
        <ScrollController
          callback={this.getMoreTracks}
          enableScroll={this.state.enableScroll}>
          <div className="container">
            <div className="search-content-wrapper">
              <div className="field-group-wrapper">
                <div className="search-field-wrapper">
                  <SearchField
                    changeCallback={this.setSearchTerm}
                    searchCallback={this.getTracks}/>
                </div>
                <div className="select-group-wrapper">
                  <div className="select-field-wrapper">
                    <SelectField callback={this.setSelectedType}/>
                  </div>
                  <div className="search-field-button-wrapper">
                    <button onClick={() => this.getTracks()} className="button-main button-search">Search</button>
                  </div>
                </div>
              </div>
              {this.state.listData
                ? <div className="search-result-wrapper">
                  {this.getListTemplate(this.state.listData)}
                </div>
                : <NoResult type={RESULT_TYPES.NOT_START}/>}
            </div>
          </div>
        </ScrollController>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  {getTracksByParams}
)(Search);

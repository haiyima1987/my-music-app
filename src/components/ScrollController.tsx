import * as React from 'react';
import { RefObject } from 'react';
import { connect } from "react-redux";

interface Props {
  children: any;
  callback: Function;
  enableScroll: boolean;
}

const THROTTLE_DELAY = 20;
const SCROLL_OFFSET = 200;

class ScrollController extends React.Component<Props> {
  /** refs for DOM scroll values **/
  readonly wrapperRef: RefObject<HTMLDivElement>;
  readonly contentRef: RefObject<HTMLDivElement>;
  private isLocked: boolean = true;
  private readonly handler: EventListener;

  constructor(props: Props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.contentRef = React.createRef();
    this.handler = this.throttle(this.notifyScroll, THROTTLE_DELAY);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handler, true);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    /** lock the scroller from firing get more items call **/
    if (!prevProps.enableScroll && this.props.enableScroll) {
      this.isLocked = false;
    }
  }

  /** remove the bound handler on unmount **/
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handler);
  }

  /** throttle for performance **/
  throttle = (callback: Function, limit: number): EventListener => {
    let locked: boolean = false;
    let timeout: any = undefined;
    return function (e: MouseEvent) {
      if (!locked) {
        locked = true;
        callback(e);
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(e), limit * 2);
        setTimeout(() => locked = false, limit);
      }
    } as EventListener
  }

  notifyScroll = (e: MouseEvent) => {
    if (this.isLocked) return;
    const wrapper = this.wrapperRef.current!;
    const content = this.contentRef.current!;
    if (wrapper.scrollTop + window.innerHeight > content.offsetHeight - SCROLL_OFFSET) {
      /** lock it until the parent allows the next call to be fired **/
      this.isLocked = true;
      this.props.callback();
    }
  }

  render() {
    const {children} = this.props;

    return (
      <div ref={this.wrapperRef} className="scroll-controller-wrapper">
        <div ref={this.contentRef} className="controller-content-wrapper">
          {children}
        </div>
      </div>
    );
  }
}

export default connect()(ScrollController);

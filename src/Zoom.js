import React from "react";

export default class Zoom extends React.Component {
    state = {
      vm: new ZoomViewModel(),
      maxZoomed: false,
      minZoomed: false
    };
  
    componentDidMount() {
      this.props.view.when(this.onViewLoaded);
    }
  
    onViewLoaded = (view) => {
      this.state.vm.view = view;
      watchUtils.init(view, "zoom", this.onZoomChange);
    };
  
    onZoomChange = (value) => {
      this.setState({
        maxZoomed: value === view.constraints.maxZoom,
        minZoomed: value === view.constraints.minZoom
      });
    };
  
    zoomIn = () => {
      if (!this.state.maxZoomed) {
        this.state.vm.zoomIn();
      }
    };
  
    zoomOut = () => {
      if (!this.state.minZoomed) {
        this.state.vm.zoomOut();
      }
    };
  
    render() {
      const maxstate = this.state.maxZoomed ? "button circle raised disable" : "button circle raised";
      const minstate = this.state.minZoomed ? "button circle raised disable" : "button circle raised";
      return (
        <div className="zoom-btns">
          <div className={maxstate} onClick={this.zoomIn}>
            <div className="center">
              <i className="material-icons">add</i>
            </div>
          </div>
          <div className={minstate} onClick={this.zoomOut}>
            <div className="center">
              <i className="matFerial-icons">remove</i>
            </div>
          </div>
        </div>
      );
    }
  }
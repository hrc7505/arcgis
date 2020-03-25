import React from 'react';
import './App.css';
import List from './arcgisComponents/List';
import { Route } from 'react-router-dom';
import LayerDetails from './arcgisComponents/LayerDetails';
//import ArcGISUtility from './ArcGISUtility';

export default class App extends React.Component {
  render() {
    return (
      <div id="z" className="">
        <Route exact path="/" component={List} />
        <Route exact path="/:layerId" component={LayerDetails} />
      </div>
    );
  }

  componentDidMount() {

    //  ArcGISUtility.addToDefinations();
    //  ArcGISUtility.updateData();
  }
}

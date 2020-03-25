import React from "react";
import ArcGISUtility from "../ArcGISUtility";
import "./list.css";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import CreateLayer from "./CreateLayer";

export default class List extends React.Component {
    layers = [];
    isLoading;
    showModal = true;

    render() {
        return (
            <>
                <div className="header">
                    <h1>Layers</h1>
                    <button onClick={this.toggleModal}>Add Layer</button>
                </div>
                <Modal isOpen={this.showModal}>
                    <button onClick={this.toggleModal}>X</button>
                    <CreateLayer />
                </Modal>
                <div className="list">
                    {
                        this.isLoading
                            ? "Loading"
                            : this.layers.map((layer) => (
                                <Link to={`/${layer.id}`} key={layer.id} className="listItem">
                                    <img src={`https://Wecreate.maps.arcgis.com/sharing/rest/content/items/${layer.id}/info/${layer.thumbnail}?token=${ArcGISUtility.TOKEN}`} />
                                    <h3>{layer.title}</h3>
                                </Link>
                            ))
                    }
                </div>
            </>
        );
    }

    async componentDidMount() {
      /*   this.isLoading = true;
        this.forceUpdate();
        const data = await ArcGISUtility.getLayers();
        this.isLoading = false;
        this.layers = data.results;
        this.forceUpdate(); */
    }

    toggleModal = () => {
        this.showModal = !this.showModal;
        this.forceUpdate();
    }
}
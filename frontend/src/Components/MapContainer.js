import React, { Component } from 'react'
import './MapContainer.css';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapComponent extends Component {
 
  render() {
    return (
      <div className="mapContainer">
        <Map
          google={this.props.google}
          initialCenter={
            {
              lat: this.props.latitude,
              lng: this.props.longitude,
            }
          }
          zoom={16}
          center={{
            lat: this.props.latitude,
            lng: this.props.longitude,
        }}>

          <Marker onClick={this.onMarkerClick} key="Marker1"
            draggable={false}
            position={{
              lat: this.props.latitude,
              lng: this.props.longitude,
            }}
          />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: process.env.REACT_APP_API_KEY
 }
))(MapComponent)

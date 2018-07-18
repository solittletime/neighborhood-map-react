import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet.smooth_marker_bouncing/leaflet.smoothmarkerbouncing.js';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.markers = [];
    this.leaf = null;
    this.places = require("./places.json");

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    let input = document.getElementById('filter');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById("list");
    let li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
      if (li[i].innerText.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        if (!this.markers[i].display) {
          this.markers[i].display = true;
          this.markers[i].addTo(this.leaf);
        }
      } else {
        li[i].style.display = "none";
        if (this.markers[i].display) {
          this.markers[i].display = false;
          this.markers[i].removeFrom(this.leaf);
        }
      }
    }
  }

  handleClick(t) {
    this.markers[t.id].bounce(3);
    this.markers[t.id].openPopup();
  }

  componentDidMount() {
    this.leaf = L.map('mapid', {
      zoomControl: false
    }).setView([42.363, -71.091], 14);

    L.control.zoom({
      position: 'topright'
    }).addTo(this.leaf);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicGZ1dGVya28iLCJhIjoiY2ppYW4zazVjMTB3ZTN2czl3a3ltdHBxcyJ9.4t8oMQa0-RGfXjCu1HPihA'
    }).addTo(this.leaf);

    this.places.forEach(place => {
      let marker = L.marker([place.response.venue.location.lat, place.response.venue.location.lng],
        { title: place.response.venue.name }).addTo(this.leaf);
      let s = "<b>" + place.response.venue.name + "</b><br>";
      place.response.venue.location.formattedAddress.map((line) => {
        return s = s + line + "<br>";
      });
      s = s + place.response.venue.contact.formattedPhone + "<br>";
      marker.bindPopup(s);
      marker.display = true;
      this.markers.push(marker);
    })
  };

  render() {
    let list = this.places.map((place) => {
      return <li id={place.index} key={place.index} onClick={(e) => this.handleClick(e.target)}>{place.response.venue.name}</li>;
    })

    return (
      <div>
        <div className="modal">
          <input type="search" id="filter" onChange={this.handleChange} placeholder="Search for names.." />
          <ul id="list">{list}</ul>
        </div>
        <div id="mapid"></div>
      </div>
    );
  }
}

export default App;

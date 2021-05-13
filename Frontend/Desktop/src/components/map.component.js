import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
//DO NOT REMOVE NEXT LINE
//eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

//https://api.mapbox.com/geocoding/v5/mapbox.places/iowa%20state%20university.json?types=address&access_token=pk.eyJ1IjoibG9ncmFuZCIsImEiOiJja2w4Y2gwMGoyNGwxMm9xajM1YWJ6YmJnIn0.l4ocHpd5Wy5fJXGumuayUA

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoibG9ncmFuZCIsImEiOiJja2w4Y2gwMGoyNGwxMm9xajM1YWJ6YmJnIn0.l4ocHpd5Wy5fJXGumuayUA';

export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mapContainer = React.createRef();
    }

    state = {
        location: null,
        taskLocation: null,
        flag: 0
    };

    componentDidMount() {
        if (this?.props?.location?.state !== undefined) {
            // console.log(this.props.location.state.location);
            // console.log(this.props.location.state.taskLocation);
            this.setState({location: this.props.location.state.location});
            this.setState({taskLocation: this.props.location.state.taskLocation});

            const zoom = 12;
            const start = [this.props.location.state.location.longitude, this.props.location.state.location.latitude];
            const end = [this.props.location.state.taskLocation.longitude, this.props.location.state.taskLocation.latitude];

            const geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl});
            const map = new mapboxgl.Map({
                container: this.mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: start,
                zoom: zoom
            });


            //activates on the user loading the map
            map.on('load', () => {
                // make an initial directions request that
                // starts and ends at the same location initializes map
                getRoute(start, start);

                //add start point circle (visual only)
                map.addLayer({
                    id: 'start',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: start
                                }
                            }
                            ]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#3887be'
                    }
                });

                //add end point circle (visual only)
                map.addLayer({
                    id: 'end',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: end
                                }
                            }
                            ]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#be384c'
                    }
                });

                //creates actual route
                getRoute(start, end);
            });


        //returns a route based on start and end points, start point is fixed currently
        const getRoute = (start, end) => {


            let url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] +
                ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
            // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = function() {
                let json = JSON.parse(req.response);
                let data = json.routes[0];
                let route = data.geometry.coordinates;
                let geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: route
                    }
                };


                // if the route already exists on the map, reset it using setData
                if (map.getSource('route')) {
                    map.getSource('route').setData(geojson);
                } else { // otherwise, make a new request
                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: geojson
                                }
                            }
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#3887be',
                            'line-width': 5,
                            'line-opacity': 0.75
                        }
                    });
                }
                let instructions = document.getElementById('instructions');
                let steps = data.legs[0].steps;
                let tripInstructions = "";
                for (let i = 0; i < steps.length; i++) {
                    tripInstructions = tripInstructions + '<li>' + steps[i].maneuver.instruction + '</li>';
                    instructions.innerHTML = '<br><span class="duration">Trip duration: ' + Math.floor(data.duration / 60) + ' min  </span>' + '<ul>' + tripInstructions + '</ul>';
                }
            };
            req.send();
        };
            this.setState({flag: 0});
        }
        else {
            this.setState({flag: 1});
        }
    }


    render() {
        //const { lng, lat, zoom } = this.props.state;
        // get the sidebar and add the instructions
        console.log(this.state.flag);
        if(this.state.flag == 0){
        return (
            <div>
                <div ref={this.mapContainer} className="map-container" />
                <div id="instructions">
                </div>
            </div>
        );
        }
        else{
            return(
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h3>No Route Selected: </h3>
                            <p>Please go to the assignment page and select an assignment to route</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


//old stuff for reference
/*
        //parses direction and enters them in box
        geocoder.on('result', (e) => {
            //let test = document.getElementById('test');
            let coords = e.result.center
            console.log('longitude= ', coords[0]);
            console.log('latitude= ', coords[1]);
            this.setState({
                lng: coords[0],
                lat: coords[1]
            });
            //this.test.innerHTML = coords;


        })
        //component for showing current state values
        map.addControl(geocoder);
        //updates center coordinates when the user moves the map
        map.on('move', () => {
            /*this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            }, () => {
                //console.log('longitude= ', this.props.state.lng);
                //console.log('latitude= ', this.props.state.lat);
            });
        });*/
/*//picks endpoint when user clicks
        map.on('click', (e) => {
            let startCoords = [this.props.state.lng, this.props.state.lat];
            console.log('longitude= ',this.props.state.lng);
            console.log('latitude= ',this.props.state.lat);
            let coordsObj = e.lngLat;
            let endCoords = Object.keys(coordsObj).map(function(key) {
                return coordsObj[key];
            });
            let start = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: startCoords
                    }
                }
                ]
            };
            let end = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: endCoords
                    }
                }
                ]
            };
            if (map.getLayer('end')) {
                map.getSource('end').setData(end);
            } else {
                map.addLayer({
                    id: 'end',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: endCoords
                                }
                            }]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#f30'
                    }
                });
                if(map.getLayer('start')){
                    map.getSource('start').setData(start)
                } else{
                    map.addLayer({
                        id: 'start',
                        type: 'circle',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: [{
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'Point',
                                        coordinates: startCoords
                                    }
                                }
                                ]
                            }
                        },
                        paint: {
                            'circle-radius': 10,
                            'circle-color': '#3887be'
                        }
                    });
                }
            }
            getRoute(startCoords, endCoords);
        })*/






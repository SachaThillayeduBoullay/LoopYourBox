let currentPosition = [4.352418, 50.846772];
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVjb2RlbmV0cCIsImEiOiJja2gyNngzbHYwOW1pMnBwY2hkODZuenlqIn0.gh5aASyG_4J54nUTh9LMyA';
let map;

map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: currentPosition, // Starting position [lng, lat]
  zoom: 12, // Starting zoom level
});

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {enableHighAccuracy: true},
        trackUserLocation: true,
        fitBoundsOptions: {maxZoom:12}
    })
);

let features = partnerInfo.map(element => {
    return  {
        'type': 'Feature',
        'properties': {
            'description': `<a href="/partner/${element._id}">${element.name}</a>
            <p>${element.address.street}</p>
            <p>${element.address.postcode} ${element.address.city}</p>`,
            'icon': 'rocket'
        },
        'geometry': {
            'type': 'Point',
            'coordinates': element.address.coordinates
        }
    }
});

map.on('load', function () {
    map.addSource('places', {
        'type': 'geojson',
        'data':{
            'type': 'FeatureCollection',
            'features': features
        }
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
            'icon-image': '{icon}-15',
            'icon-size': 2,
            'icon-allow-overlap': true
        }
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'places', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
        map.flyTo({
        center: e.features[0].geometry.coordinates
        });

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);


    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });
});
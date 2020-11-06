let currentPosition = [4.352418, 50.846772];
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVjb2RlbmV0cCIsImEiOiJja2gyNngzbHYwOW1pMnBwY2hkODZuenlqIn0.gh5aASyG_4J54nUTh9LMyA';
let map;

/*if ("geolocation" in navigator) {
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        let crd = pos.coords;
        currentPosition=[crd.longitude, crd.latitude];
        map = new mapboxgl.Map({
            container: 'map', // Container ID
            style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
            center: currentPosition, // Starting position [lng, lat]
            zoom: 12, // Starting zoom level
          });
          var marker = new mapboxgl.Marker() // initialize a new marker
  .setLngLat(currentPosition) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map
      }
      
      function error(err) {
        console.warn(`ERREUR (${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);
  } else {
    console.log('ca marche pas ')  //la géolocalisation n'est pas disponible 
  }*/

//console.log(currentPosition)

map = new mapboxgl.Map({
  container: 'map', // Container ID
  style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
  center: currentPosition, // Starting position [lng, lat]
  zoom: 12, // Starting zoom level
});

map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    })
    );
/*
new mapboxgl.Marker() // initialize a new marker
  .setLngLat(currentPosition) // Marker [lng, lat] coordinates
  .addTo(map); // Add the marker to the map*/

//console.log(testInfo)
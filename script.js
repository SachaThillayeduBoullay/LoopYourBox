// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVjb2RlbmV0cCIsImEiOiJja2gyNngzbHYwOW1pMnBwY2hkODZuenlqIn0.gh5aASyG_4J54nUTh9LMyA';
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
});
    
geocoder.addTo('#geocoder');

geocoder.on('result', function(results) {
    console.log(results);
})
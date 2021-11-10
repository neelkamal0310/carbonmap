var mapboxAccessToken = 'pk.eyJ1IjoieHJjdDI0NTk4IiwiYSI6ImNrdnQxcWllbDM4cmoydXRrZDRtcnFiMWEifQ.Cf9VxCZj75VACubkrSfp0w';
var map = L.map('map').setView([55.3781,3.4360], 5);

let statesData;
let carbonReadings = {};

fetch('uk.geojson')
.then(res => res.json())
.then(out => {
    statesData = out;
    getReadings();
})

function getReadings() {
    fetch('https://api.carbonintensity.org.uk/regional')
        .then(res => res.json())
        .then(out => {
            out.data[0].regions.forEach((region, ind) => {
                carbonReadings[region.regionid] = {name: region.dnoregion, carbon: region.intensity.forecast}
            })
            initMap();
            initLegend();
        })
}

function getColor(d) {
    x = carbonReadings[d].carbon
    return x < 100 ?  '#feebe2' :
        x < 200 ?  '#fbb4b9' :
        x < 300 ?  '#f768a1' :
        x < 400 ?  '#c51b8a' :
                '#7a0177' 
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.regionid),
        weight: 3,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
}

function initMap() {
    L.tileLayer('mapbox://styles/xrct24598/ckvsdufwb0y6i15o5xap6bn0q', {
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var geojson;

    geojson = L.geoJson(statesData, {
        style: style,
    }).addTo(map);
}

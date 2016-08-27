
var update;
var home = {lat: 30.326421, lon: -97.740396}
var homeCompass = document.getElementById('home')
var northCompass = document.getElementById('north')
var direction = document.getElementById('heading')
var loc = document.getElementById('position')
var debug = document.getElementById('debugger')
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        update = getUpdateFunction(home)
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {


        var navId = navigator.geolocation.watchPosition(function(pos){
            loc.innerHTML = "Lat: " + pos.coords.latitude +'<br /> Lon: ' + pos.coords.longitude
            update({type:'position', value: pos.coords})

        }, function(err){
            position.innerHTML = "Position ERROR:" + err.code + err.message
        }, { maximumAge: 3000, timeout: 1000, enableHighAccuracy: true });

        var watchId = navigator.compass.watchHeading(function(heading){
            direction.innerHTML = 'DEGREES:' + Math.floor(heading.magneticHeading)
            update({type:'heading', value: heading.magneticHeading})

        }, function(err){
            direction.innerHTML = "Bearing ERROR:" + err.code + err.message
        }, {frequency: 100})

        // var bearing = goHome(pos.coords.latitude, pos.coords.longitude, home.lat, home.lon)
    }
};
// WHERE: φ1,λ1 is the start point, φ2,λ2 the end point
// (Δλ is the difference in longitude)


function goHome(lat1, lon1, lat2, lon2){
  lat1 *= Math.PI/180
  lon1 *= Math.PI/180
  lat2 *= Math.PI/180
  lon2 *= Math.PI/180

  var y = Math.sin(lon2-lon1) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) -
          Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  var brng = Math.atan2(y, x)*(180/Math.PI);
  return brng
}

/*
  obj = {
    type: 'position' | 'heading',
    value: number
  }
*/

function getUpdateFunction(home){
  var home = home
  var position;
  var heading;
  var count = 0

  return function(obj){

    if(obj.type == "position"){ position = obj.value}
    else if(obj.type == "heading") { heading = obj.value}

    var bearingFromNorth = goHome(position.latitude, position.longitude, home.lat, home.lon);
    debug.innerHTML = bearingFromNorth
    homeCompass.style.transform = 'rotateZ('+((45-heading)+bearingFromNorth)+'deg)'
    northCompass.style.transform = 'rotateZ('+(45-heading)+'deg)'
  }
}


app.initialize();
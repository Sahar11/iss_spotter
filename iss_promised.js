const request = require('request-promise-native');

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API'
  return request('https://api.ipify.org?format=json');
 
};
///////////
const fetchCoordsByIP = function(ip, callback) {
 return request('https://api.freegeoip.app/json/?apikey=5a13ffa0-53ef-11ec-b480-cd85107c13af')
 
}
/*
* Requests data from api.open-notify.org using provided lat/long data
* Input: JSON body containing geo data response from freegeoip.app
* Returns: Promise of request for fly over data, returned as JSON string
*/
const fetchISSFlyOverTimes = function(body) {
 const { latitude, longitude } = JSON.parse(body);
 const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
 return request(url);
};

/*
* Input: None
* Returns: Promise for fly over data for users location
*/
const nextISSTimesForMyLocation = function() {
 return fetchMyIP()
   .then(fetchCoordsByIP)
   .then(fetchISSFlyOverTimes)
   .then((data) => {
     const { response } = JSON.parse(data);
     return response;
   });
};

module.exports =  nextISSTimesForMyLocation ;
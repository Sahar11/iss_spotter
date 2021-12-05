/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API'
  request('https://api.ipify.org?format=json', (error, response, body) => {
 
    if (error) {
      callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the ip

    const ip = JSON.parse(body);
    if (!error) { 
      callback(null, ip); // Print the error if one occurred
    } 
  
    console.log(ip);
  });
};
///////////
const fetchCoordsByIP = function(ip, callback) {
  request('https://api.freegeoip.app/json/?apikey=5a13ffa0-53ef-11ec-b480-cd85107c13af', (error, response, body) => {
 
    if (error) {
      callback(error, null);
    }
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }
  const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });

 
});
}

/////

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
 const fetchISSFlyOverTimes = function(coords, callback) {
  request('https://iss-pass.herokuapp.com/json/?lat=43.5639&lon=-79.7172', (error, response, body) => {
 
    if (error) {
      callback(error, null);
      return;
    }
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
    callback(Error(msg), null);
    return;
  }
  const passes = JSON.parse(body).response;

    callback(null, passes);
 
});

};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = nextISSTimesForMyLocation;

var express = require('express');
var router = express.Router();

var flightControl = require('../controller/flightController');

/* Function to get home page : showing search form and results
   If no criteria is specified by the user then it will display all documents 
   Function calls 'searchListFlightDetails' function .
   -which takes req and res as parameters
*/
router.get('/', function(req, res) {
    return flightControl.searchListFlightDetails(req, res);
});

/* Function to which calls fn add flight details.
  Calls function 'saveFlightDetails' which adds flight details 
*/
router.post('/saveFlightDetails', function(req, res) {
    return flightControl.saveFlightDetails(req, res);
});

/* Function to filter search is called here  */
router.post('/searchListFlightDetails', function(req, res) {
    return flightControl.searchListFlightDetails(req, res);
});

/* Function to show add flight details form is called here */
router.get('/addFlightDetails', function(req, res) {
    return flightControl.addFlightDetails(req, res);
});

module.exports = router;
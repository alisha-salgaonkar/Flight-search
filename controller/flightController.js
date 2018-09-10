var flightModel = require('../model/flightModel');
var dateFormat = require('dateformat');

/*  Function name : addFlightDetails
    Function called when url is '/addFlightDetails'
    This function renders add flight details form
*/
function addFlightDetails(req, res) {
    res.render('saveFlightDetails');
}

/*  Function name : searchListFlightDetails
    Function is called when url is '/' or when user enters the search criteria an presses on search button.
    This function :
        - Gets all the user input passed by user.
        - Trims and performs insensitive search
*/
function searchListFlightDetails(req, res) {
    // Variable declaration
    let query = {
        $and: []
    };    
    var origin         = req.body.origin;
    var destination    = req.body.destination;
    var departureDate  = req.body.departureDate;
    var returnDate     = req.body.returnDate;
    var passengers     = req.body.passengers;
    var price          = req.body.price;

    // Pushes status active. By default it will search for all documents with status as Active
    query.$and.push({
        status: 'active'
    });

    // Checks if origin is entered by user . If enetered then it searches the origin name by user
    if (origin)
        query.$and.push({
            origin: new RegExp(origin.trim(), 'i')
        });

    // Checks if destination is entered by user . If enetered then it searches the destination by user
    if (destination)
        query.$and.push({
            destination: new RegExp(destination, 'i')
        });

    // Checks if departureDate is entered by user . If enetered then it searches the departure date by user
    if (departureDate) {
        var day = new Date(departureDate);
        var selDate = day.toISOString();

        var nextDay = new Date(day);
        nextDay.setDate(day.getDate()+1);
        nextDay = nextDay.toISOString();

        query.$and.push({
            originDepartureDate : {
                "$eq"  : selDate,
                "$gte" : selDate, 
                "$lt"  : nextDay 
            }
        });

    }

    // Checks if returnDate is entered by user . If enetered then it searches the return date entered by user
    if (returnDate) {
        var selectedDate = new Date(returnDate);
        var selDateISO = selectedDate.toISOString();
        var nextDateISO = new Date(selectedDate);
        nextDateISO.setDate(selectedDate.getDate()+1);
        nextDateISO = nextDateISO.toISOString();
        
        query.$and.push({           
            destinationDepartureDate : {
                "$gte" : selDateISO, 
                "$lt"  : nextDateISO 
            }
        });
    }

    // Checks if passenger is entered by user . If enetered then it searches if there are seats available
    if (passengers) {
        query.$and.push({
            availableSeats: {
                "$gte" : JSON.parse(passengers)
            }
        }); 
    }
    // Checks if price is entered by user . If enetered then it searches if that price is available or not
    if (price) {
        console.log(price);
        query.$and.push({
            price: {
                "$eq" : JSON.parse(price),
            }
        });
    }
    // selects documents as per the searching criteria in query array or selects all documents and returns
    // Perform sort on price 
    flightModel.find(query)
        .sort({
            price: "desc"
        })
        .exec(function(error, result) {
            if (error) {
                return;
            }
            // dummy array is created of result
            var result1 = [];
            result1 = JSON.parse(JSON.stringify(result));

            // Iterates the result object and adds timing in object to be printed in .hbs file
            result1.forEach(function(doc, index) {
                // Gets origin deeparture date       
                result1[index]["originDepartureDate"] = dateFormat(doc.originDepartureDate, "d mmmm yyyy");
                // Gets origin departure time       
                result1[index]["originDepartureTime"] = dateFormat(doc.originDepartureDate, "h:MM:TT");
                // Gets destination destination arrival time        
                result1[index]["destArrivalTime"] = dateFormat(doc.destinationArrivalDate, "h:MM:TT");
                // Gets destination departure date        
                result1[index]["destDepartureDate"] = dateFormat(doc.destDepartureDate, "d mmmm yyyy");
                // Gets destination departure time       
                result1[index]["destDepartureTime"] = dateFormat(doc.destDepartureDate, "h:MM:TT");
                // Gets destination origin arrival time        
                result1[index]["originArrivalTime"] = dateFormat(doc.originArrivalTime, "h:MM:TT");
            });

            // renders search flights by iterating through flightsData object
            res.render('searchFlights', {
                flightsData: result1
            });
        });
}

/*  Function name : saveFlightDetails
    Function is called when url is '/saveFlightDetails'
    This function :
        - Gets all the user input entered to add flight details.
        - Parameterss : req, res
*/
function saveFlightDetails(req, res) {
    // Takes the values of operationalDays [Array of strings] [mon,tue,wed,thu,fri,sat]=> [0,1,2,3,4,5,6,7]
    // OperationalDays is array strings 
    var oprDays = req.body.operationalDays;
    if (oprDays) {
        // Iterated through array, parse each element to convert as number
        oprDays.forEach(function(item, index){
            oprDays[index] = JSON.parse(oprDays[index]);
        });
    }

    // var originDepartureDate      = req.body.originDepartureDate;
    // var originArrivalDate        = req.body.originArrivalDate;
    // var destinationDepartureDate = req.body.destinationDepartureDate;
    // var destinationArrivalDate   = req.body.destinationArrivalDate;

    // if (originDepartureDate) 
    //     originDepartureDate = new Date(originDepartureDate).toISOString();

    // if (originArrivalDate) 
    //     originArrivalDate = new Date(originArrivalDate).toISOString();

    // if (destinationDepartureDate) 
    //     destinationDepartureDate = new Date(destinationDepartureDate).toISOString();

    // if (destinationArrivalDate) 
    //     destinationArrivalDate = new Date(destinationArrivalDate).toISOString();

    // Get all input data and assign to properties inn object 'flightData'
    var flightData = {
                airlineName: req.body.airlineName,
                airlineCode: req.body.airlineCode,
               flightNumber: req.body.flightNumber,
                     origin: req.body.origin,
                destination: req.body.destination,
             availableSeats: req.body.availableSeats,
                      price: req.body.price,
        originDepartureDate: req.body.originDepartureDate,
          originArrivalDate: req.body.originArrivalDate,
   destinationDepartureDate: req.body.destinationDepartureDate,
     destinationArrivalDate: req.body.destinationArrivalDate,
                   duration: req.body.duration,
            operationalDays: oprDays
    };

    console.log("flightData",flightData);
    // Saves the data in db
    var entity = new flightModel(flightData);
    entity.save(function(error, success) {
        // If error exists assign error to object and use that object to show the error
        if (error) {
            var errMsg = "There was Error " + error + "\n";
            // Renders saveFlightDetails view and show error there
            res.render('saveFlightDetails', {
                error: errMsg
            });
            return;
        }
        // Renders saveFlightDetails view and show the success message
        res.render('saveFlightDetails', {
            success: success
        });
    });
}

module.exports = {
    addFlightDetails,
    saveFlightDetails,
    searchListFlightDetails
}
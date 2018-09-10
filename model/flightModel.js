var mongoose = require('mongoose');

// Connection code
mongoose.connect('mongodb://127.0.0.1:27017/flights', { useMongoClient: true });

var Schema = mongoose.Schema;
var flightSchema = new mongoose.Schema({
				  airlineName: { type: String, required: true},
				  airlineCode: { type: String, required: true },
				 flightNumber: { type: Number, required: true },
					   origin: { type: String, required: true },
				  destination: { type: String, required: true},
			   availableSeats: { type: Number, required: true, min:20, max:100},
						price: { type: Number, required: true, min:1000 },
		  originDepartureDate: { type: Date, required: true},
	   destinationArrivalDate: { type: Date , required: true}, 
			originArrivalDate: { type: Date}, 
	 destinationDepartureDate: { type: Date},
					 duration: { type: String, required: true },
			  operationalDays: { type: [Number]},
					  status : {
								   type: String,
								   enum: ['active', 'deleted'],
								default: 'active',
								}

});

var flightDetails = mongoose.model('flightDetails', flightSchema);
module.exports = flightDetails;
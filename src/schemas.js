const mongoose = require('mongoose');
const { Schema } = mongoose;

const rideSchema = new Schema({
  rideID: { type: Number, required: true, unique: true },
  startLatitude: { type: Number, required: true },
  startLongitude: { type: Number, required: true },
  endLatitude: { type: Number, required: true },
  endLongitude: { type: Number, required: true },
  riderName: { type: String, required: true },
  driverName: { type: String, required: true },
  driverVehicle: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
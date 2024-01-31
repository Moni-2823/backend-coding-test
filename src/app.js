'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const Ride = require('./schemas');

app.get('/health', (req, res) => res.send('Healthy'));

// Endpoint to create a new ride record in the database with validations.
// Validates the request body parameters and saves the ride data to the database.
// Returns the saved ride data or an error response.
app.post('/rides', jsonParser, async (req, res) => {
    try {
        
        let {startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle, rideID} = req.body;
        startLatitude = parseInt(startLatitude);
        startLongitude = parseInt(startLongitude);
        endLatitude = parseInt(endLatitude);
        endLongitude = parseInt(endLongitude);    
    
        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }
    
        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }
    
        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
    
        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
    
        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }
    
        const values = {startLatitude, startLongitude, endLatitude, endLongitude, riderName, driverName, driverVehicle, rideID};
    
        const db = new Ride(values);
        const savedData = await db.save();
        return res.status(201).send(savedData);
    } catch (error) {
        console.log('error', error);
        return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error'
        });
    }
});

// app.get('/rides', async (req, res) => {
//     const rides = await Ride.find();
//     if (rides.length === 0) {
//       return res.send({
//         error_code: 'RIDES_NOT_FOUND_ERROR',
//         message: 'Could not find any rides'
//       });
//     }
//     res.send(rides);
//     });


app.get('/rides', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
    if (endIndex < (await Ride.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
  
    try {
      results.results = await Ride.find().limit(limit).skip(startIndex).exec();
      res.send(results);
    } catch (err) {
      res.status(500).send({ error_code: 'SERVER_ERROR', message: err.message });
    }
  });
  
    app.get('/rides/:id', async (req, res) => {
        try {
            const ride = await Ride.findOne({ _id: req.params.id });
    
            if (!ride) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
    
            res.send(ride);
        } catch (error) {
            // Handle any potential errors here
            console.error(error);
            res.status(500).send({
                error_code: 'SERVER_ERROR',
                message: 'Internal Server Error'
            });
        }
    });

module.exports = app;
// };

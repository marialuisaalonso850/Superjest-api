const mongoose = require('mongoose');
const Trip = require('../models/trip.model');

(async () => {
    await mongoose.connect('mongodb://127.0.0.1/product')

    const newTrip = await Trip.create({
        name: 'Jabon protex',
        description: 'Jabon para cuerpo',
        destination: 'Armenia',
        category: 'aseo',
        start_date: '2023-11-20'


    });

    console.log(newTrip);
})();
//Rutas de la api

const router = require('express').Router();
router.use('/trips', require('./trips.routes'));


module.exports = router;
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Trip = require('../../models/trip.model');

describe('pruebas sobre los productos ingresados',  () => {

    beforeAll(async () =>{
        await mongoose.connect('mongodb://127.0.0.1/product');
    });

    afterAll( async () => {
        await mongoose.disconnect();
    });

    describe('GET /api/trips', () => {

        let response;
        beforeEach(async () => {
            response = await request(app).get('/api/trips').send();
        })
    
        it('La ruta funciona', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
    
        it('La petición nos devuelve un array de trips', async () => {
            expect(response.body).toBeInstanceOf(Array);
        });
    
    });

    describe('POST /api/trips', () => {

        const newTrip = { name: 'labial', destination: 'Armenia', category: 'maquillaje', start_date: '2023-11-20' };
        const wrongTrip = { nombre: 'labial' };

        afterAll(async () => {
            await Trip.deleteMany({ name: 'labial' });
        });

        it('La ruta funcione', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Se inserta correctamente', async () => {
            const response = await request(app).post('/api/trips').send(newTrip);

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newTrip.name);
        });

        it('Error en la inserción', async () => {
            const response = await request(app).post('/api/trips').send(wrongTrip);

            expect(response.status).toBe(500);
            expect(response.body.error).toBeDefined();
        });

    });

    describe('PUT /api/trips', () => {

        let trip;
        beforeEach(async () => {
            trip = await Trip.create({ name: 'Arroz', destination: 'Armenia', category: 'comida', start_date: '2023-11-20' });
        });

        afterEach(async () => {
            await Trip.findByIdAndDelete(trip._id);
        });

        it('La ruta funciona', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'arroz leche'
            });

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Se actualiza correctamente', async () => {
            const response = await request(app).put(`/api/trips/${trip._id}`).send({
                name: 'trip updated'
            });

            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('trip updated');
        });

    });

    describe('DELETE /api/trips', () => {

        let trip;
        let response;
        beforeEach(async () => {
            trip = await Trip.create({ name: 'Arroz', destination: 'Armenia', category: 'comida', start_date: '2023-11-20' });
            response = await request(app).delete(`/api/trips/${trip._id}`).send();
        });

        it('La ruta funciona', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        it('Borra correctamente', async () => {
            expect(response.body._id).toBeDefined();

            const foundTrip = await Trip.findById(trip._id);
            expect(foundTrip).toBeNull();
        })

    });


});




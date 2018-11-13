const request = require('supertest');
const moment = require('moment');
const { Rental }  = require('../../models/rental');
const { User }  = require('../../models/user');
const { Movie }  = require('../../models/movie');
const mongoose = require('mongoose');
let server;

describe('/api/returns', () => {
    let customerId, movieId, rental, token, movie;
    beforeEach(async () => { 
        server = require('../../index'); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            numberInStock: 10,
            dailyRentalRate: 2,
            genre: { name: '12345'}
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                isGold: true,
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'Movie Title',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => { 
        await Rental.remove({});
        await Movie.remove({});
        await server.close(); 
    });

    let exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
    }

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec(); 
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie', async () => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if is a valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async () => {
        const res = await exec();
        const processedRental = await Rental.findById(rental._id);
        const diff = new Date() - processedRental.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rental fee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();
        const processedRental = await Rental.findById(rental._id);
        expect(processedRental.rentalFee).toBe(14);
    });

    it('should increase the movie stock', async () => {
        const res = await exec();
        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental', async () => {
        const res = await exec();
        const rentalInDB = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'rentalFee', 'dateReturned', 'customer', 'movie'])
        );
    });
});
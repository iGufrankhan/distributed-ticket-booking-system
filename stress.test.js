import request from 'supertest';
import mongoose from 'mongoose';
import { jest } from '@jest/globals'; 
import app from './app.js'; 

import { client as redisClient } from './src/Config/redisConfig.js';
import { paymentQueue } from './src/services/queue/queue.service.js';
import { generateAccessToken } from './utils/token.js';
import Seat from './src/models/seat.models.js';
import { Show } from './src/models/show.models.js';

describe('Concurrency Load Testing - 1000 Requests', () => {
    jest.setTimeout(60000); 

// testing show id and user id for testing
    const testShowId = "6a8bf2f7b0e88b7884ecd0c6"; 
    const realUserId = "69d3d10dd3a7142d3edbab43"; 
    
    let testToken;

    beforeAll(async () => {
    
        await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 1000 });
        
       
        await Show.findByIdAndUpdate(testShowId, { status: "active" });

        
        await Seat.updateMany(
            { showId: testShowId, seatNumber: { $in: ['A1', 'A2'] } },
            { $set: { status: 'available', lockedBy: null, lockedAt: null } }
        );

       // for auth middleware ,warna acess denied ho jaega
        testToken = generateAccessToken(realUserId);
    });

    afterAll(async () => {
        //close 
        await mongoose.connection.close();
        await redisClient.quit();
        await paymentQueue.close();
    });

    it('should securely handle 1000 users trying to lock the same seats simultaneously', async () => {
        const TOTAL_REQUESTS = 1000;
        const requestPromises = [];

     
        for (let i = 0; i < TOTAL_REQUESTS; i++) {
            requestPromises.push(
                request(app)
                    .post('/api/v1/bookings/book-seats') 
                    .set('Authorization', `Bearer ${testToken}`)
                    .send({ 
                        showId: testShowId, 
                        seats: ['A1', 'A2'] 
                    })
            );
        }

       // fired all all request (baki sab sahi ha)
        const responses = await Promise.all(requestPromises);

        const successfulLocks = responses.filter(res => res.status === 200 || res.status === 201);
        const failedLocks = responses.filter(res => res.status >= 400);

       
        if (successfulLocks.length === 0 && failedLocks.length > 0) {
           console.log("First Failure Response:", failedLocks[0].body);
        }

   //    i am the winner 1 user can lock the seat and 999 users will get failed response
        expect(successfulLocks.length).toBe(1);
        expect(failedLocks.length).toBe(999);
    });
});
import { client } from '../../Config/redisConfig.js';
import Seat from '../../models/seat.models.js';
import { SEAT_LOCK_EXPIRY } from '../../../utils/constant.js';
import { ApiError } from '../../../utils/ApiError.js';

export const lockSeats = async (showId, seatNumbers, userId) => {
    const expirySeconds = SEAT_LOCK_EXPIRY * 60;
    
    // Lock individual seats
    const promises = seatNumbers.map(seat => 
        client.set(`seatlock:${showId}:${seat}`, userId.toString(), 'EX', expirySeconds, 'NX')
    );
    const results = await Promise.all(promises);
    if (results.includes(null)) {
        throw new ApiError(409, 'Some seats are already locked');
    }

    // Also update seat status in DB
    await Seat.updateMany(
        { showId, seatNumber: { $in: seatNumbers }, status: 'available' },
        { 
            status: 'locked', 
            lockedBy: userId,
            lockedAt: new Date()
        }
    );

    return true;
};

export const unlockSeats = async (showId, seatNumbers, userId) => {
    // Unlock individual seats
    const promises = seatNumbers.map(async (seat) => {
        const lockKey = `seatlock:${showId}:${seat}`;
        const lockValue = await client.get(lockKey);
        
        if (lockValue && lockValue !== userId.toString()) {
            throw new ApiError(403, 'Cannot unlock seats locked by another user');
        }
        
        return client.del(lockKey);
    });
    
    await Promise.all(promises);

    // Update seat status in DB
    await Seat.updateMany(
        { showId, seatNumber: { $in: seatNumbers }, status: 'locked' },
        { 
            status: 'available', 
            lockedBy: null,
            lockedAt: null
        }
    );

    return true;
};

export const releaseSeats = async (showId, seats) => {
    const promises = seats.map(seat =>
        client.del(`seatlock:${showId}:${seat}`)
    );
    await Promise.all(promises);

    await Seat.updateMany(
        { showId, seatNumber: { $in: seats }, status: 'locked' },
        { 
            status: 'available', 
            lockedBy: null,
            lockedAt: null
        }
    );
};

export const isSeatLocked = async (showId, seatNumbers) => {
    const promises = seatNumbers.map(seat => 
        client.get(`seatlock:${showId}:${seat}`)
    );
    const results = await Promise.all(promises);
    return results.some(lockValue => lockValue !== null);
};




import { client } from '../../Config/redisConfig.js';
import Seat from '../../models/seat.models.js';
import { SEAT_LOCK_EXPIRY } from '../../../utils/constant.js';
import { ApiError } from '../../../utils/ApiError.js';

export const lockSeats = async (showId, seatNumbers, userId) => {
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = userId.toString();
    const expirySeconds = SEAT_LOCK_EXPIRY * 60;
    
    const result = await client.set(lockKey, lockValue, { EX: expirySeconds, NX: true });
    
    if (result === null) {
        throw new ApiError(409, 'Seats are already locked by another user');
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
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = await client.get(lockKey);
    
    if (lockValue && lockValue !== userId.toString()) {
        throw new ApiError(403, 'Cannot unlock seats locked by another user');
    }
    
    await client.del(lockKey);

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
    const lockKey = `seatlock:${showId}:${seats.sort().join(',')}`;
    await client.del(lockKey);

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
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = await client.get(lockKey);
    return lockValue !== null;
};




import { client } from '../../Config/redisConfig.js';
import { SEAT_LOCK_EXPIRY } from '../../../utils/constant.js';
import { asyncHandler } from '../../../utils/AsyncHandler.js';
import { ApiError } from '../../../utils/ApiError.js';

export const lockSeats = asyncHandler(async (showId, seatNumbers, userId) => {
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = userId;
    const expirySeconds = SEAT_LOCK_EXPIRY * 60;
    const result = await client.set(lockKey, lockValue, { EX: expirySeconds, NX: true });
    if (result === null) {
        throw new ApiError('Seats are already locked by another user', 409);
    }
    return true;
});

export const unlockSeats = asyncHandler(async (showId, seatNumbers, userId) => {
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = await client.get(lockKey);
    if (lockValue !== userId) {
        throw new ApiError('Cannot unlock seats locked by another user', 403);
    }
    await client.del(lockKey);
    return true;
});

export const releaseSeats = asyncHandler(async (showId, seats) => {
    const keys = seats.map(seat => `seatlock:${showId}:${seat}`);
    await client.del(keys);
});

export const isSeatLocked = asyncHandler(async (showId, seatNumbers) => {
    const lockKey = `seatlock:${showId}:${seatNumbers.sort().join(',')}`;
    const lockValue = await client.get(lockKey);
    return lockValue !== null;
});




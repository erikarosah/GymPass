import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidadeCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { LateCheckInValidateError } from './errors/late-check-in-validate-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidadeCheckInUseCase;

describe('Check-in Use Case',  () => {
    beforeEach( async() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidadeCheckInUseCase(checkInsRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id:'gym-01',
            user_id: 'user-01',
        });

        const { checkIn} = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
    });

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(() => 
            sut.execute({
                checkInId: 'inexistent-check-in-id'
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not be able to validate to check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023 , 5, 12, 13, 0));

        const createdCheckIn = await checkInsRepository.create({
            gym_id:'gym-01',
            user_id: 'user-01',
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21;
        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidateError);
    });
});
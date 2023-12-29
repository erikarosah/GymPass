import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Academia',
            description: '',
            phone:'',
            latitude: new Decimal(-18.9692848),
            longitude: new Decimal(-43.0921941)
        });

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async() => {
        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.9692848,
            userLongitude: -43.0921941

        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check on the same day', async() => {
        vi.setSystemTime(new Date(2023, 3, 15, 8, 0, 0));

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.9692848,
            userLongitude: -43.0921941
        });

        expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.9692848,
            userLongitude: -43.0921941

        })).rejects.toBeInstanceOf(Error);
    });

    it('should be able to check in at different days', async() => {
        vi.setSystemTime(new Date(2023, 3, 15, 8, 0, 0));

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.9692848,
            userLongitude: -43.0921941
        });

        vi.setSystemTime(new Date(2023, 3, 16, 8, 0, 0));

        const {checkIn} = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -18.9692848,
            userLongitude: -43.0921941
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async() => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia2',
            description: '',
            phone:'',
            latitude: new Decimal(-18.9692848),
            longitude: new Decimal(-43.0921941)
        });

        await expect(() => sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -12.9692848,
            userLongitude: -40.0921941

        })).rejects.toBeInstanceOf(Error);
    });
});
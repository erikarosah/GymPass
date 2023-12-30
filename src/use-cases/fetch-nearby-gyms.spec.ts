import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCases } from './fetch-nearby-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCases;

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach( async() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCases(gymsRepository);
    });

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near gym',
            description: null,
            phone: null,
            latitude: -18.9692848,
            longitude: -43.0921941 
        });

        await gymsRepository.create({
            title: 'Far gym',
            description: null,
            phone: null,
            latitude: -12.9692848,
            longitude: -41.0921941 
        });

        const { gyms } =  await sut.execute({
            userLatitude: -18.9692848,
            userLongitude: -43.0921941 
        });
        
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Near gym'})
        ]);
    });
});